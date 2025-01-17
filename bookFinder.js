const jobForm = document.getElementById('job-form');
const refreshButton = document.getElementById('refresh-button');
const bookList = document.getElementById('book-list');
let currentCategory = '';
let jobCategories = {};

// JSON 파일 로드
fetch('job.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('직업 카테고리 파일을 로드할 수 없습니다.');
        }
        return response.json();
    })
    .then(data => {
        jobCategories = data; // 직업 카테고리 데이터 저장
    })
    .catch(error => {
        console.error('Error loading job categories:', error);
    });

// 책 데이터를 가져오는 함수
function fetchBooks(category) {
    bookList.innerHTML = '<p>추천 도서를 가져오는 중...</p>';

    const apiKey = 'AIzaSyCiwV0bCzsHesAM8hZcZ_MtAykX4xLkUO8';
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(category)}&maxResults=5&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            bookList.innerHTML = '';
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const book = item.volumeInfo;
                    const thumbnail = book.imageLinks ? book.imageLinks.thumbnail : null;
                    const description = book.description ? book.description.slice(0, 10) + '...' : '설명 없음';

                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    bookItem.innerHTML = `
                        ${
                            thumbnail
                                ? `<img src="${thumbnail}" alt="${book.title}">`
                                : '<div class="no-image">이미지 없음</div>'
                        }
                        <div>
                            <h3>${book.title || '제목 없음'}</h3>
                            <p><strong>저자:</strong> ${book.authors ? book.authors.join(', ') : '저자 정보 없음'}</p>
                            <p><strong>출판사:</strong> ${book.publisher || '출판사 정보 없음'}</p>
                            <p><strong>출판일:</strong> ${book.publishedDate || '출판일 정보 없음'}</p>
                            <p>${description}</p>
                            <a href="${book.infoLink}" target="_blank">더 알아보기</a>
                        </div>
                    `;
                    bookList.appendChild(bookItem);
                });
            } else {
                bookList.innerHTML = '<p>해당 카테고리에 대한 도서를 찾을 수 없습니다.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            bookList.innerHTML = '<p>도서를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.</p>';
        });
}

// 직업 입력 폼 이벤트 처리
jobForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const job = document.getElementById('job-input').value.trim();

    if (jobCategories[job]) {
        currentCategory = jobCategories[job];
        fetchBooks(currentCategory);
        refreshButton.style.display = 'inline-block'; // 새로 추천 버튼 표시
    } else {
        bookList.innerHTML = '<p>해당 직업에 대한 추천 카테고리가 없습니다. 다시 입력해주세요.</p>';
    }
});

// 새로 추천 받기 버튼 이벤트
refreshButton.addEventListener('click', function () {
    if (currentCategory) {
        fetchBooks(currentCategory); // 동일 카테고리로 새 추천
    }
});
