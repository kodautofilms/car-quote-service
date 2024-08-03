// services.js

document.addEventListener('DOMContentLoaded', function() {
    loadServices();

    document.getElementById('addServiceButton').addEventListener('click', function() {
        showPopup('Create a Service');
    });

    document.getElementById('popupClose').addEventListener('click', function() {
        hidePopup();
    });

    document.getElementById('cancelButton').addEventListener('click', function() {
        hidePopup();
    });

    document.getElementById('serviceForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton.textContent === 'Add Service') {
            addService();
        } else if (submitButton.textContent === 'Update Service') {
            const index = submitButton.getAttribute('data-index');
            updateService(index);
        }
    });
});

function loadServices() {
    updateServicesList();
}

function updateServicesList() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';

    const services = JSON.parse(localStorage.getItem('services')) || [];

    services.forEach((service, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${service.name}: ${service.description}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteService(index);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editService(index);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => copyService(index);

        listItem.appendChild(editButton);
        listItem.appendChild(copyButton);
        listItem.appendChild(deleteButton);

        servicesList.appendChild(listItem);
    });
}

function showPopup(headerText) {
    document.getElementById('servicePopup').style.display = 'block';
    document.getElementById('servicePopup').querySelector('h2').textContent = headerText;
}

function hidePopup() {
    document.getElementById('servicePopup').style.display = 'none';
    document.getElementById('serviceForm').reset();
}

function addService() {
    const serviceName = document.getElementById('serviceName').value;
    const serviceDescription = document.getElementById('serviceDescription').value;

    if (!serviceName || !serviceDescription) {
        alert("All fields are required.");
        return;
    }

    const service = {
        name: serviceName,
        description: serviceDescription
    };

    let services = JSON.parse(localStorage.getItem('services')) || [];
    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
    hidePopup();
}

function deleteService(index) {
    let services = JSON.parse(localStorage.getItem('services')) || [];
    services.splice(index, 1);
    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
}

function editService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services[index];

    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description;

    showPopup('Edit Service');

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Service';
    submitButton.setAttribute('data-index', index);
}

function updateService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];

    services[index].name = document.getElementById('serviceName').value;
    services[index].description = document.getElementById('serviceDescription').value;

    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
    hidePopup();

    // Reset form submission to add service
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = 'Add Service';
    submitButton.removeAttribute('data-index');
}

function copyService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services[index];

    const newService = { ...service };
    services.push(newService);

    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
}
