// ✅ 허용된 닉네임
const allowedUsers = ["타미", "대구프린스", "명명", "김뼝"];

// ✅ 로그인
function login() {
    const nickname = document.getElementById("nickname").value.trim();

    if (!allowedUsers.includes(nickname)) {
        document.getElementById("login-error").innerText = "접근 불가 닉네임입니다.";
        return;
    }

    localStorage.setItem("user", nickname);

    // ✅ 30일 유효기간 설정
    if (!localStorage.getItem("startDate")) {
        localStorage.setItem("startDate", new Date().toISOString());
    }

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-screen").classList.remove("hidden");

    document.getElementById("welcome").innerText = nickname + "님 환영합니다!";
}

// ✅ 유효기간 확인
function checkExpiration() {
    const start = localStorage.getItem("startDate");
    if (!start) return;

    const diff = (new Date() - new Date(start)) / (1000 * 60 * 60 * 24);

    if (diff > 30) {
        document.getElementById("expired-message").innerText = "30일이 지나 사용이 종료되었습니다.";
        document.querySelectorAll("button").forEach(btn => btn.disabled = true);
    }
}

checkExpiration();

// ✅ 기록 저장
function saveRecord() {
    const user = localStorage.getItem("user");
    const date = new Date().toISOString().split("T")[0];

    const record = {
        distance: document.getElementById("distance").value,
        steps: document.getElementById("steps").value,
        speed: document.getElementById("speed").value
    };

    localStorage.setItem(`${user}_${date}`, JSON.stringify(record));

    document.getElementById("save-message").innerText = "저장 완료!";
}

// ✅ 주간 기록 보기
function showWeeklySection() {
    document.getElementById("weekly-section").classList.remove("hidden");
    document.getElementById("main-screen").classList.add("hidden");

    const user = localStorage.getItem("user");
    const tbody = document.querySelector("#weekly-table tbody");
    tbody.innerHTML = "";

    let totalDist = 0, totalSteps = 0, totalSpeed = 0, count = 0;

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const date = d.toISOString().split("T")[0];

        const data = localStorage.getItem(`${user}_${date}`);

        if (data) {
            const r = JSON.parse(data);

            tbody.innerHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${r.distance}</td>
                    <td>${r.steps}</td>
                    <td>${r.speed}</td>
                </tr>
            `;

            totalDist += Number(r.distance);
            totalSteps += Number(r.steps);
            totalSpeed += Number(r.speed);
            count++;
        }
    }

    document.getElementById("weekly-summary").innerText =
        `총 거리: ${totalDist}km / 총 걸음수: ${totalSteps} / 평균 속도: ${(count ? totalSpeed / count : 0).toFixed(1)} km/h`;
}

// ✅ 화면 이동
function showInputSection() {
    document.getElementById("input-section").classList.remove("hidden");
    document.getElementById("main-screen").classList.add("hidden");
}

function backToMain() {
    document.getElementById("input-section").classList.add("hidden");
    document.getElementById("weekly-section").classList.add("hidden");
    document.getElementById("main-screen").classList.remove("hidden");
}

function logout() {
    location.reload();
}
