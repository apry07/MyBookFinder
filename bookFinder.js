document.getElementById('category-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const category = document.getElementById('category-input').value.trim();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '<p>추천 도서를 가져오는 중...</p>';

    // Google Books API 요청
    const apiKey = 'AIzaSyCiwV0bCzsHesAM8hZcZ_MtAykX4xLkUO8'; // 자신의 API 키
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(category)}&maxResults=5&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            bookList.innerHTML = ''; // 기존 메시지 초기화

            if (data.items && data.items.length > 0) {
                // 데이터가 있을 경우 책 리스트 출력
                data.items.forEach(item => {
                    const book = item.volumeInfo;
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    bookItem.innerHTML = `
                        <h3>${book.title || '제목 없음'}</h3>
                        <p><strong>저자:</strong> ${book.authors ? book.authors.join(', ') : '저자 정보 없음'}</p>
                        <p><strong>출판사:</strong> ${book.publisher || '출판사 정보 없음'}</p>
                        <p><strong>출판일:</strong> ${book.publishedDate || '출판일 정보 없음'}</p>
                        <p><strong>설명:</strong> ${book.description || '설명 없음'}</p>
                        <a href="${book.infoLink}" target="_blank">더 알아보기</a>
                    `;
                    bookList.appendChild(bookItem);
                });
            } else {
                // 데이터가 없을 경우 메시지 출력
                bookList.innerHTML = '<p>해당 카테고리에 대한 도서를 찾을 수 없습니다.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            bookList.innerHTML = '<p>도서를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.</p>';
        });
});
