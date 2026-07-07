    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }

    window.addEventListener('beforeunload', function() {
        window.scrollTo(0, 0);
    });


const API_URL = "http://127.0.0.1:8000/api";

const norm = (v) => (v || "").trim().toLowerCase();

function card(d) {
    return `
        <div class="menu-card">
            <h4>${d.name || ""}</h4>
            <p>${d.description || ""}</p>
            <b>${d.price ?? ""} €</b>
        </div>
    `;
}

async function renderMenu() {
    const drinksBox = document.getElementById("menu-drinks");
    const mainBox = document.getElementById("menu-main");
    const startersBox = document.getElementById("menu-starters");
    const flex = document.getElementById("main-menu-flex");
    const empty = document.getElementById("empty-menu-msg");

    if (!drinksBox || !mainBox || !startersBox || !flex || !empty) {
        console.error("❌ Missing menu containers in HTML");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/menu`);
        if (!res.ok) throw new Error("HTTP error " + res.status);

        const menu = await res.json();

        console.log("MENU:", menu);

        if (!Array.isArray(menu) || menu.length === 0) {
            flex.style.display = "none";
            empty.style.display = "block";
            return;
        }

        flex.style.display = "flex";
        empty.style.display = "none";

        const drinks = menu.filter(d => d.category === "drinks");
        const main = menu.filter(d => d.category === "main");
        const starters = menu.filter(d => d.category === "starters");

        drinksBox.innerHTML = drinks.map(card).join("");
        mainBox.innerHTML = main.map(card).join("");
        startersBox.innerHTML = starters.map(card).join("");

    } catch (err) {
        console.error("LOAD ERROR:", err);
        flex.style.display = "none";
        empty.style.display = "block";
    }
}

window.addEventListener("load", renderMenu);