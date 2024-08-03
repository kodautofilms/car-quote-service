const checkboxStates = {};
const selectedServices = {};

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

function loadServices() {
    updateServicesList();
}

function addService() {
    const serviceName = document.getElementById('serviceName').value;
    const serviceDescription = document.getElementById('serviceDescription').value;
    const servicePrice = document.getElementById('servicePrice').value;
    const serviceDuration = document.getElementById('serviceDuration').value;
    const panels = Array.from(document.querySelectorAll('input[name="panel"]:checked')).map(cb => cb.value);

    const options = Array.from(document.querySelectorAll('#optionsFieldset .option')).map(optionDiv => ({
        name: optionDiv.querySelector('input[name="optionName"]').value,
        description: optionDiv.querySelector('input[name="optionDescription"]').value,
        price: optionDiv.querySelector('input[name="optionPrice"]').value,
        calcMethod: optionDiv.querySelector('select[name="optionCalcMethod"]').value,
    }));

    if (!serviceName || !serviceDescription || !servicePrice || !serviceDuration || panels.length === 0) {
        alert("All fields are required.");
        return;
    }

    const service = {
        name: serviceName,
        description: serviceDescription,
        price: servicePrice,
        duration: serviceDuration,
        panels: panels,
        options: options
    };

    let services = JSON.parse(localStorage.getItem('services')) || [];
    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();

    resetForm();
}

function updateService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];

    services[index].name = document.getElementById('serviceName').value;
    services[index].description = document.getElementById('serviceDescription').value;
    services[index].price = document.getElementById('servicePrice').value;
    services[index].duration = document.getElementById('serviceDuration').value;

    const panels = Array.from(document.querySelectorAll('input[name="panel"]:checked')).map(cb => cb.value);
    services[index].panels = panels;

    const options = Array.from(document.querySelectorAll('#optionsFieldset .option')).map(optionDiv => ({
        name: optionDiv.querySelector('input[name="optionName"]').value,
        description: optionDiv.querySelector('input[name="optionDescription"]').value,
        price: optionDiv.querySelector('input[name="optionPrice"]').value,
        calcMethod: optionDiv.querySelector('select[name="optionCalcMethod"]').value,
    }));
    services[index].options = options;

    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
    resetForm();
}



function updateServicesList() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';

    const services = JSON.parse(localStorage.getItem('services')) || [];

    services.forEach((service, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${service.name}: ${service.description} ($${service.price}, ${service.duration} minutes) [Panels: ${service.panels.join(', ')}]`;

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

        const optionsList = document.createElement('ul');
        service.options.forEach(option => {
            const optionItem = document.createElement('li');
            optionItem.textContent = `${option.name}: ${option.description} ($${option.price}) [Calculation Method: ${option.calcMethod}]`;
            optionsList.appendChild(optionItem);
        });
        listItem.appendChild(optionsList);

        servicesList.appendChild(listItem);
    });
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
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDuration').value = service.duration;

    const panels = document.querySelectorAll('input[name="panel"]');
    panels.forEach(panel => {
        panel.checked = service.panels.includes(panel.value);
    });

    // Change button text to "Update Service" and store the index
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Service';
    submitButton.setAttribute('data-index', index);
}

function updateService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];

    services[index].name = document.getElementById('serviceName').value;
    services[index].description = document.getElementById('serviceDescription').value;
    services[index].price = document.getElementById('servicePrice').value;
    services[index].duration = document.getElementById('serviceDuration').value;

    const panels = Array.from(document.querySelectorAll('input[name="panel"]:checked')).map(cb => cb.value);
    services[index].panels = panels;

    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
    resetForm();
}

function copyService(index) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services[index];

    const newService = { ...service };
    services.push(newService);

    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();
}

function addService() {
    const serviceName = document.getElementById('serviceName').value;
    const serviceDescription = document.getElementById('serviceDescription').value;
    const servicePrice = document.getElementById('servicePrice').value;
    const serviceDuration = document.getElementById('serviceDuration').value;
    const panels = Array.from(document.querySelectorAll('input[name="panel"]:checked')).map(cb => cb.value);

    if (!serviceName || !serviceDescription || !servicePrice || !serviceDuration || panels.length === 0) {
        alert("All fields are required.");
        return;
    }

    const service = {
        name: serviceName,
        description: serviceDescription,
        price: servicePrice,
        duration: serviceDuration,
        panels: panels,
        options: []
    };

    let services = JSON.parse(localStorage.getItem('services')) || [];
    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));
    updateServicesList();

    resetForm();
}

function resetForm() {
    document.getElementById('serviceForm').reset();
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = 'Add Service';
    submitButton.removeAttribute('data-index');
}

document.getElementById('addOptionButton').addEventListener('click', function() {
    const optionsFieldset = document.getElementById('optionsFieldset');
    const newOptionDiv = document.createElement('div');
    newOptionDiv.classList.add('option');
    newOptionDiv.innerHTML = `
        <label for="optionName">Option Name:</label>
        <input type="text" name="optionName" required>

        <label for="optionDescription">Option Description:</label>
        <input type="text" name="optionDescription" required>

        <label for="optionPrice">Option Price:</label>
        <input type="number" name="optionPrice" required>

        <label for="optionCalcMethod">Calculation Method:</label>
        <select name="optionCalcMethod" required>
            <option value="sqft">Sq Ft</option>
            <option value="percentage">Percentage</option>
            <option value="panel">Panel</option>
        </select>
    `;
    optionsFieldset.appendChild(newOptionDiv);
});

function showPopup(panel) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popupContent');
    const popupClose = document.getElementById('popupClose');

    popupContent.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = panel;
    popupContent.appendChild(title);

    const services = JSON.parse(localStorage.getItem('services')) || [];

    services.filter(service => service.panels.includes(panel)).forEach(service => {
        const checkboxContainer = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${panel}-${service.name}`;
        checkbox.name = `${panel}-${service.name}`;
        checkbox.dataset.service = service.name;
        checkbox.dataset.panel = panel;
        checkbox.dataset.price = service.price;

        if (checkboxStates[checkbox.id]) {
            checkbox.checked = checkboxStates[checkbox.id];
        }

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = `${service.name} ($${service.price})`;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        popupContent.appendChild(checkboxContainer);

        checkbox.addEventListener('change', (event) => {
            updateSidebar(event);
            updateOverlay(event, panel);
            checkboxStates[checkbox.id] = checkbox.checked;
        });
    });

    popup.style.display = 'block';

    popupClose.onclick = function() {
        popup.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    }
}

function updateSidebar(event) {
    const checkbox = event.target;
    const serviceList = document.getElementById('servicesList');
    const serviceItemId = `service-${checkbox.id}`;
    const serviceName = checkbox.dataset.service;
    const panel = checkbox.dataset.panel;
    const price = checkbox.dataset.price;

    if (checkbox.checked) {
        if (!selectedServices[serviceName]) {
            selectedServices[serviceName] = [];
        }
        selectedServices[serviceName].push({
            panel: panel,
            price: price
        });
    } else {
        if (selectedServices[serviceName]) {
            selectedServices[serviceName] = selectedServices[serviceName].filter(s => s.panel !== panel);
            if (selectedServices[serviceName].length === 0) {
                delete selectedServices[serviceName];
            }
        }
    }

    serviceList.innerHTML = '';
    for (const service in selectedServices) {
        const serviceItem = document.createElement('li');
        const panels = selectedServices[service].map(s => `${s.panel} ($${s.price})`).join(', ');
        serviceItem.innerHTML = `<strong>${service}</strong>: ${panels}`;
        serviceList.appendChild(serviceItem);
    }
}

function updateOverlay(event, content) {
    const checkbox = event.target;
    const overlayId = document.querySelector(`area[alt="${content}"]`).dataset.overlay;
    const overlay = document.getElementById(overlayId);

    if (checkbox.checked) {
        overlay.style.display = 'block';
    } else {
        const checkboxes = document.querySelectorAll(`[id^="${content}-"]`);
        let isAnyChecked = false;
        checkboxes.forEach(cb => {
            if (cb.checked) {
                isAnyChecked = true;
            }
        });
        if (!isAnyChecked) {
            overlay.style.display = 'none';
        }
    }
}

function resizeImageMap() {
    const image = document.getElementById('carImage');
    const map = document.getElementById('carMap');
    const areas = map.getElementsByTagName('area');
    const originalWidth = 1920;
    const originalHeight = 1080;

    const scaleX = image.clientWidth / originalWidth;
    const scaleY = image.clientHeight / originalHeight;

    for (let area of areas) {
        const originalCoords = area.dataset.coords.split(',').map(Number);
        const scaledCoords = originalCoords.map((coord, index) => {
            return index % 2 === 0 ? coord * scaleX : coord * scaleY;
        });
        area.coords = scaledCoords.join(',');

        const overlayId = area.dataset.overlay;
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.innerHTML = '';
            const points = scaledCoords.map((coord, index) => {
                return `${coord}${index % 2 === 0 ? ',' : ' '}`;
            }).join('');
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', points.trim());
            polygon.setAttribute('fill', 'rgba(0, 0, 255, 0.3)');
            overlay.appendChild(polygon);
            overlay.style.left = '0px';
            overlay.style.top = '0px';
            overlay.style.width = image.clientWidth + 'px';
            overlay.style.height = image.clientHeight + 'px';
        }
    }
}

window.addEventListener('resize', resizeImageMap);
window.addEventListener('load', resizeImageMap);

document.addEventListener('DOMContentLoaded', () => {
    const areas = document.getElementsByTagName('area');
    for (let area of areas) {
        area.dataset.coords = area.coords;
    }
    resizeImageMap();

    // Add hover overlay
    const hoverOverlay = document.getElementById('hoverOverlay');
    hoverOverlay.setAttribute('fill', 'rgba(0, 0, 255, 0.3)');
    hoverOverlay.style.display = 'none';
    document.querySelector('.image-container').appendChild(hoverOverlay);

    for (let area of areas) {
        area.addEventListener('mouseover', function() {
            const scaledCoords = area.coords.split(',').map(Number);
            const points = scaledCoords.map((coord, index) => {
                return `${coord}${index % 2 === 0 ? ',' : ' '}`;
            }).join('');
            hoverOverlay.setAttribute('points', points.trim());
            hoverOverlay.style.display = 'block';
        });
        area.addEventListener('mouseout', function() {
            hoverOverlay.style.display = 'none';
        });
    }
});
