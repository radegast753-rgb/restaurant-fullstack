window.addEventListener("beforeunload", () => {
    console.log("PAGE RELOAD");
});

const API_URL = "https://pizza-fullstack-api.onrender.com/api";

const passwordInput = document.getElementById("pass-input");
const togglePassword = document.getElementById("toggle-password");
const loginBtn = document.getElementById("login-btn");

togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});


loginBtn.addEventListener("click", () => {
    const password = passwordInput.value;
    const error = document.getElementById("error-msg");

    if (password === "admin123") {
        document.getElementById("login-block").classList.add("hidden");
        document.getElementById("admin-panel").classList.remove("hidden");
        error.textContent = "";
    } else {
        error.textContent = "Wrong password";
    }
});

const dishForm = document.getElementById("dish-form");

dishForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addDish();
});

async function addDish() {
    const title = document.getElementById("dish-title");
    const price = document.getElementById("dish-price");
    const desc = document.getElementById("dish-desc");
    const category = document.getElementById("category");

    const cleanPrice = parseFloat(price.value);

    if (!title.value || isNaN(cleanPrice)) {
        alert("Invalid input");
        return;
    }

    const newDish = {
        name: title.value.trim(),
        price: cleanPrice,
        description: desc.value.trim(),
        category: category.value,
        image_url: ""
    };

    try {
        const res = await fetch(`${API_URL}/menu`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDish)
        });

        if (!res.ok) throw new Error("API error");

        title.value = "";
        price.value = "";
        desc.value = "";

        await updatePreview();

    } catch (e) {
        console.error(e);
    }
}

async function updatePreview() {
    const preview = document.getElementById("preview-list");

    try {
        const res = await fetch(`${API_URL}/menu`);
        const menu = await res.json();

        preview.innerHTML = "";

        if (menu.length === 0) {
            preview.innerHTML = "<p>No dishes yet</p>";
            return;
        }

        menu.forEach(dish => {
            const item = document.createElement("div");

            item.className = "preview-item";

            item.innerHTML = `
         <h4>${dish.name}</h4>
         <p>${dish.category}</p>
         <p>${dish.description}</p>
         <b>${dish.price} €</b>
        <button type="button" onclick="deleteDish(${dish.id})" class="btn-danger">
             Delete
        </button>
        `;

            preview.appendChild(item);
        });

    } catch (err) {
        console.error("Preview error:", err);
    }
}

async function deleteDish(id) {
    console.log("DELETE", id);

    try {
        const res = await fetch(`${API_URL}/menu/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Delete failed");
        }

        await updatePreview();

    } catch (err) {
        console.error("Delete error:", err);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    updatePreview();
});