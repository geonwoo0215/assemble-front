import Component from "/src/components/Component.js";

export default class ExpenseDetail extends Component {

    expenseId;
    partyId;
    partyMemberId;
    commentList;
    static instance;
    constructor(target, partyId, expenseId, partyMemberId) {
        if (ExpenseDetail.instance) {
            ExpenseDetail.instance.setup();
            return ExpenseDetail.instance;
        }
        super(target);
        this.partyId = partyId;
        this.expenseId = expenseId;
        this.partyMemberId = partyMemberId;
        this.setup();

        ExpenseDetail.instance = this;
    }

    template() {
        const { expense } = this.state;
        const { commentList } = this.commentList;
        return `
        <div class="default-form">
            <p class="top-text-left">Assemble</p>
            <p class="top-text-left">모임 상세정보</p>
            
            <div class="expense-info">
                <div class="expense-price">
                    <p>총 결제금액</p>
                    <p class="price">${expense.price}원</p>
                </div>

                <div class="expense-individual-price">
                    <p>인당 금액</p>
                    <p class="individualPrice">${expense.individualPrice}원</p>
                </div>

                <p class="expense-content">${expense.content}</p>
                <div class="expense-payerName">
                    <p>결제자</p>
                    <p class="payerName">${expense.payerName}</p>
                </div>


                <div class="expense-member-list">
                    <p class="top-text-left">정산 요청 인원</p>
                    ${expense.memberNames.map(partyMemberName => `
                    <p>${partyMemberName}</p>
                    `).join('')}
                </div>
                
                <div class="expense-image">
                    <p class="top-text-left">첨부 사진</p>
                    ${expense.imageUrls.map(objectKey => `
                    <a href="https://assemble-image-bucket.s3.ap-northeast-2.amazonaws.com/${objectKey}" target="_blank">
                        <img src="https://assemble-image-bucket.s3.ap-northeast-2.amazonaws.com/${objectKey}">
                    </a>
                    `).join('')}
                </div>

                <div class="expense-comment-list">
                    <p class="top-text-left">댓글</p>
                    ${commentList.map(comment => `
                    <p style="--depth: ${comment.depth || 0}">${comment.comment}</p>
                    <button class="replyButton" data-comment-id="${comment.id}">답글</button>
                `).join('')}
                </div>

                <div class="expense-comment-input">
                    <label for="comment0"></label>
                    <textarea id="comment0" class="expense-comment-box"></textarea>
                    <button class="saveButton">등록</button>
                </div>

            </div>
        </div>
        `;
    }

    setEvent() {
        this.target.querySelector('.saveButton').addEventListener('click', () => {
            this.saveComment(0);
            this.setup();
        });

        const replyAndCancelButtonContainer = this.target;

        const handleReplyButtonClick = (event) => {
            const commentId = event.target.dataset.commentId;
            const existingCommentInput = replyAndCancelButtonContainer.querySelector(`.expense-comment-input[data-comment-id="${commentId}"]`);

            if (!existingCommentInput) {
                const newCommentInput = `
                <div class="expense-comment-input" data-comment-id="${commentId}">
                    <label for="comment${commentId}"></label>
                    <textarea id="comment${commentId}" class="expense-comment-box"></textarea>
                    <button class="cancelButton">취소</button>
                    <button class="replySaveButton">답글 등록</button>
                </div>
            `;
                const commentContainer = event.target;
                commentContainer.insertAdjacentHTML('afterend', newCommentInput);
                const replySaveButton = replyAndCancelButtonContainer.querySelector('.replySaveButton');
                replySaveButton.addEventListener('click', () => {
                    const commentId = replySaveButton.parentNode.dataset.commentId;

                    this.saveComment(commentId);

                    const commentInput = replySaveButton.parentNode;
                    commentInput.remove();
                    this.setup();
                });

            }
        };

        replyAndCancelButtonContainer.querySelectorAll('.replyButton').forEach(replyButton => {
            replyButton.addEventListener('click', handleReplyButtonClick);
        });

        replyAndCancelButtonContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('cancelButton')) {
                const commentInput = event.target.parentNode;
                commentInput.remove();
            }
        });
    }

    async setup() {
        this.state = await this.loadExpenseData();
        this.commentList = await this.loadExpenseCommentData();
        this.render();
        this.setEvent();
    }

    async loadExpenseData() {
        const partyId = this.partyId;
        const expenseId = this.expenseId;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/expense/${expenseId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const expense = data.data;
                console.log("비용 상세 조회 성공");
                return { expense };
            } else {
                console.error('비용 상세 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('비용 상세 조회 오류', error);
            return [];
        }
    }

    async saveComment(commentId) {

        const token = localStorage.getItem("token");
        const partyId = this.partyId;
        const expenseId = this.expenseId;

        const partyMemberId = this.partyMemberId;

        const commentValue = this.target.querySelector(`#comment${commentId}`).value;
        if (commentValue === null || commentValue.trim() === '') {
            alert('댓글 내용을 입력해주세요.');
            return;
        }
        const expenseCommentDTO = {
            partyMemberId: partyMemberId,
            comment: commentValue,
            commentId: commentId
        };

        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/expense/${expenseId}/comment`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseCommentDTO),
            });

            if (response.ok) {
                console.log('댓글 저장 성공');
            } else {
                console.error('댓글 저장 실패');
            }
        } catch (error) {
            console.error('댓글 저장 오류', error);
        }
    }

    async loadExpenseCommentData() {
        const token = localStorage.getItem("token");
        const partyId = this.partyId;
        const expenseId = this.expenseId;

        try {
            const response = await fetch(`http://localhost:8080/partys/${partyId}/expense/${expenseId}/comment`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const commentList = data.data;
                console.log(commentList);
                console.log("댓글 조회 성공");
                return { commentList };
            } else {
                console.error('댓글 조회 실패');
                return [];
            }
        } catch (error) {
            console.error('댓글 조회 오류', error);
            return [];
        }
    }
}