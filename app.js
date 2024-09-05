document.addEventListener ('DOMContentLoaded', () => {
    const form = document.getElementById('inventoryForm');
    const itemList = document.getElementById('itemList');
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    const totalValueElem = document.getElementById('totalValue');

    const fetchItems = () => {
        const query = new URLSearchParams({ sortBy: sort.value }).toString();
        fetch(`/items?${query}`)
            .then(response => response.json())
            .then(data => {
                itemList.innerHTML = data.map(item => `
                    <li data-id="${item.id}">
                        <strong>${item.name}</strong> - ${item.quantity} units - $${item.price} - ${item.category}
                        <button onclick="editItem(${item.id})">Edit</button>
                        <button onclick="deleteItem(${item.id})">Delete</button>
                    </li>
                `).join('');
                fetchTotalValue();
            });
    };

    const fetchTotalValue = () => {
        fetch('/total')
            .then(response => response.json())
            .then(data => {
                totalValueElem.textContent = data.totalValue.toFixed(2);
            });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('itemId').value;
        const name = document.getElementById('name').value;
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;
        const category = document.getElementById('category').value;

        const url = id ? `/items/${id}` : '/items';
        const method = id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity, price, category })
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            document.getElementById('itemId').value = '';
            fetchItems();
        });
    });

    const deleteItem = (id) => {
        fetch(`/items/${id}`, { method: 'DELETE' })
            .then(() => fetchItems());
    };

    const editItem = (id) => {
        fetch(`/items/${id}`)
            .then(response => response.json())
            .then(item => {
                document.getElementById('itemId').value = item.id;
                document.getElementById('name').value = item.name;
                document.getElementById('quantity').value = item.quantity;
                document.getElementById('price').value = item.price;
                document.getElementById('category').value = item.category;
            })
        }})
    
  search.add
