const jobForm = document.getElementById('job-form');
const addJobForm = document.getElementById('add-job-form');
const bookList = document.getElementById('book-list');
const addJobStatus = document.getElementById('add-job-status');
let jobCategories = {};

// JSON 파일 로드
fetch('unique_200_jobs.json')
    .then(response => response.json())
    .then(data => {
        jobCategories = data;
    })
    .catch(error => console.error('Error loading job data:', error));

// 직업, 카테고리, 키워드 검색 기능
jobForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchQuery = document.getElementById('job-input').value.trim().toLowerCase();

    let resultFound = false;
    let resultHtml = "";

    for (const [job, details] of Object.entries(jobCategories)) {
        const { category, keywords } = details;

        // 검색어가 직업명, 카테고리, 키워드에 포함되는지 확인
        if (
            job.toLowerCase() === searchQuery || // 직업명 매칭
            category.toLowerCase() === searchQuery || // 카테고리 매칭
            keywords.some(keyword => keyword.toLowerCase().includes(searchQuery)) // 키워드 매칭
        ) {
            resultFound = true;
            resultHtml += `
                <p>직업: ${job}</p>
                <p>카테고리: ${category}</p>
                <p>키워드: ${keywords.join(', ')}</p>
                <hr>
            `;
        }
    }

    if (resultFound) {
        bookList.innerHTML = resultHtml;
    } else {
        bookList.innerHTML = '<p>검색 결과가 없습니다.</p>';
    }
});

// 새 직업 추가 기능
addJobForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // 입력값 가져오기
    const newJobName = document.getElementById('new-job-name').value.trim();
    const newJobCategory = document.getElementById('new-job-category').value.trim();
    const newJobKeywords = document.getElementById('new-job-keywords').value.split(',').map(kw => kw.trim());

    if (!newJobName || !newJobCategory || newJobKeywords.length === 0) {
        addJobStatus.innerHTML = '<p style="color: red;">모든 필드를 입력해야 합니다.</p>';
        return;
    }

    // JSON에 새 데이터 추가
    jobCategories[newJobName] = {
        category: newJobCategory,
        keywords: newJobKeywords
    };

    // 새 데이터를 서버에 저장 (이 부분은 Node.js 등의 서버와 연계 필요)
    saveJobData(jobCategories);

    addJobStatus.innerHTML = '<p style="color: green;">새로운 직업이 성공적으로 추가되었습니다.</p>';

    // 입력 필드 초기화
    addJobForm.reset();
});

// 데이터 저장 함수 (로컬에서는 작동하지 않고 서버에서 구현해야 함)
function saveJobData(data) {
    fetch('save_jobs_endpoint', { // 서버의 저장 엔드포인트
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error saving job data:', error));
}
