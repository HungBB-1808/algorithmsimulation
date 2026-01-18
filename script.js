const container = document.getElementById("bars-container");
const statusText = document.getElementById("status-text");
const codePanel = document.getElementById("code-panel");
const codeContent = document.getElementById("code-content");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");

let bars = [];
let delay = 100;
let isRunning = false;
let shouldStop = false;
let currentLang = 'java';

// DỮ LIỆU CODE MẪU
const codeLibrary = {
    bubble: {
        java: `void bubbleSort(int arr[]) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1])\n                swap(arr, j, j+1);\n}`,
        cpp: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1])\n                swap(arr[j], arr[j+1]);\n}`,
        c: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1])\n                swap(&arr[j], &arr[j+1]);\n}`,
        python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]`
    },
    selection: {
        java: `void selectionSort(int arr[]) {\n    for (int i = 0; i < n-1; i++) {\n        int min_idx = i;\n        for (int j = i+1; j < n; j++)\n            if (arr[j] < arr[min_idx]) min_idx = j;\n        swap(arr, min_idx, i);\n    }\n}`,
        cpp: `// C++ Selection Sort logic tương tự Java`,
        c: `// C Selection Sort logic tương tự Java`,
        python: `def selection_sort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i+1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]`
    },
    insertion: {
        java: `void insertionSort(int arr[]) {\n    for (int i = 1; i < n; ++i) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j = j - 1;\n        }\n        arr[j + 1] = key;\n    }\n}`,
        cpp: `// C++ logic tương tự Java`,
        c: `// C logic tương tự Java`,
        python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i-1\n        while j >= 0 and key < arr[j]:\n            arr[j+1] = arr[j]\n            j -= 1\n        arr[j+1] = key`
    },
    quick: {
        java: `void sort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        sort(arr, low, pi - 1);\n        sort(arr, pi + 1, high);\n    }\n}`,
        cpp: `// C++ QuickSort logic`,
        c: `// C QuickSort logic`,
        python: `def quick_sort(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)`
    },
    merge: {
        java: `// Merge Sort đệ quy chia để trị`,
        cpp: `// Merge Sort C++`,
        c: `// Merge Sort C`,
        python: `// Merge Sort Python`
    }
};

// --- HÀM HỆ THỐNG CƠ BẢN ---

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkStop() {
    if (shouldStop) throw new Error("STOPPED");
}

function updateStatus(text, type = "normal") {
    statusText.innerHTML = text;
    if (type === "highlight") statusText.style.color = "#f1c40f";
    else statusText.style.color = "#ecf0f1";
}

function toggleCodePanel() {
    codePanel.classList.toggle("hidden");
    const btn = document.querySelector(".btn-code");
    btn.innerText = codePanel.classList.contains("hidden") ? "Hiện Code" : "Ẩn Code";
    if (!codePanel.classList.contains("hidden")) updateCodeDisplay();
}

function switchLang(lang) {
    currentLang = lang;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
    updateCodeDisplay();
}

function updateCodeDisplay() {
    const algo = document.getElementById("algoSelect").value;
    const code = (codeLibrary[algo] && codeLibrary[algo][currentLang]) 
        ? codeLibrary[algo][currentLang] : "// Đang cập nhật...";
    codeContent.innerText = code;
}

function handleAlgoChange() {
    if (!codePanel.classList.contains("hidden")) updateCodeDisplay();
}

// --- LOGIC TẠO MẢNG & RENDER ---

async function resetAndGenerate() {
    if (isRunning) {
        shouldStop = true;
        await sleep(150); 
    }
    shouldStop = false;
    isRunning = false;
    container.innerHTML = "";
    bars = [];

    const size = parseInt(sizeSlider.value);
    document.getElementById("sizeValue").innerText = size;

    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 90) + 10;
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 3}px`; 
        bar.style.width = size > 40 ? "10px" : "30px"; 
        if (size <= 30) {
            const label = document.createElement("div");
            label.classList.add("bar-val");
            label.innerText = value;
            bar.appendChild(label);
        }

        container.appendChild(bar);
        bars.push(bar);
    }
    updateStatus("Mảng mới đã sẵn sàng. Hãy chọn thuật toán và chạy!");
}

// --- CORE: VISUALIZATION HELPERS ---
function getValue(bar) {
    if (bar.querySelector(".bar-val")) 
        return parseInt(bar.querySelector(".bar-val").innerText);
    return parseInt(bar.style.height) / 3;
}
function setValue(bar, value) {
    bar.style.height = `${value * 3}px`;
    if (bar.querySelector(".bar-val")) 
        bar.querySelector(".bar-val").innerText = value;
}

async function swap(i, j) {
    await checkStop();
    const barsDom = document.querySelectorAll(".bar");
    barsDom[i].classList.add("swapping");
    barsDom[j].classList.add("swapping");
    
    await sleep(delay);

    let val1 = getValue(barsDom[i]);
    let val2 = getValue(barsDom[j]);
    
    setValue(barsDom[i], val2);
    setValue(barsDom[j], val1);

    await sleep(delay);

    barsDom[i].classList.remove("swapping");
    barsDom[j].classList.remove("swapping");
}

async function markSorted(index) {
    const barsDom = document.querySelectorAll(".bar");
    barsDom[index].classList.add("sorted");
}

// --- THUẬT TOÁN SẮP XẾP ---

// 1. Bubble Sort 
async function bubbleSort() {
    const barsDom = document.querySelectorAll(".bar");
    let n = barsDom.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await checkStop();

            barsDom[j].classList.add("comparing");
            barsDom[j+1].classList.add("comparing");

            let v1 = getValue(barsDom[j]);
            let v2 = getValue(barsDom[j+1]);

            updateStatus(`So sánh: <b>${v1}</b> và <b>${v2}</b>`);
            await sleep(delay);

            if (v1 > v2) {
                updateStatus(`Vì ${v1} > ${v2} ➔ <span style='color:#e67e22'>Hoán đổi vị trí</span>`);
                await swap(j, j + 1);
            } else {
                updateStatus(`${v1} < ${v2} ➔ Không đổi, giữ nguyên.`);
            }

            barsDom[j].classList.remove("comparing");
            barsDom[j+1].classList.remove("comparing");
        }
        markSorted(n - 1 - i);
    }
    markSorted(0);
}

// 2. Selection Sort
async function selectionSort() {
    const barsDom = document.querySelectorAll(".bar");
    let n = barsDom.length;

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        barsDom[i].classList.add("pivot"); 
        updateStatus(`Tìm giá trị nhỏ nhất cho vị trí ${i}...`);
        
        for (let j = i + 1; j < n; j++) {
            await checkStop();
            barsDom[j].classList.add("comparing");
            
            let valJ = getValue(barsDom[j]);
            let valMin = getValue(barsDom[minIdx]);
            
            updateStatus(`So sánh ${valJ} với min hiện tại (${valMin})`);
            await sleep(delay);

            if (valJ < valMin) {
                if (minIdx !== i) barsDom[minIdx].classList.remove("swapping"); 
                minIdx = j;
                barsDom[minIdx].classList.add("swapping"); 
                updateStatus(`Tìm thấy min mới: ${valJ}`);
            }
            
            barsDom[j].classList.remove("comparing");
        }

        if (minIdx !== i) {
            updateStatus(`Đưa min (${getValue(barsDom[minIdx])}) về đầu dãy chưa xếp.`);
            await swap(i, minIdx);
        }
        
        barsDom[minIdx].classList.remove("swapping");
        barsDom[i].classList.remove("pivot");
        markSorted(i);
    }
}

// 3. Insertion Sort
async function insertionSort() {
    const barsDom = document.querySelectorAll(".bar");
    let n = barsDom.length;
    markSorted(0); 

    for (let i = 1; i < n; i++) {
        await checkStop();
        let key = getValue(barsDom[i]);
        barsDom[i].classList.add("pivot"); 
        
        updateStatus(`Lấy <b>${key}</b> chèn vào dãy đã xếp bên trái.`);
        await sleep(delay);
        
        let j = i - 1;
        while (j >= 0 && getValue(barsDom[j]) > key) {
            await checkStop();
            barsDom[j].classList.add("comparing");
            
            let valJ = getValue(barsDom[j]);
            updateStatus(`${valJ} > ${key} ➔ Đẩy ${valJ} sang phải.`);
            setValue(barsDom[j+1], valJ);
            barsDom[j+1].classList.add("sorted"); 
            await sleep(delay);
            barsDom[j].classList.remove("comparing");
            j--;
        }
        setValue(barsDom[j+1], key);
        barsDom[i].classList.remove("pivot");
        markSorted(j+1); 
    }
    updateStatus("Hoàn thành Insertion Sort!");
}

// 4. Quick Sort
async function quickSort(low, high) {
    await checkStop();
    if (low < high) {
        let pi = await partition(low, high);
        await Promise.all([
            quickSort(low, pi - 1),
            quickSort(pi + 1, high)
        ]);
    } else if (low === high) {
        markSorted(low);
    }
}

async function partition(low, high) {
    const barsDom = document.querySelectorAll(".bar");
    let pivot = getValue(barsDom[high]);
    barsDom[high].classList.add("pivot"); 
    
    updateStatus(`Chọn Pivot: <b>${pivot}</b> (cuối đoạn)`);
    await sleep(delay);
    
    let i = (low - 1);
    
    for (let j = low; j <= high - 1; j++) {
        await checkStop();
        barsDom[j].classList.add("comparing");
        let valJ = getValue(barsDom[j]);
        
        if (valJ < pivot) {
            i++;
            updateStatus(`${valJ} < Pivot ➔ Đưa về bên trái.`);
            await swap(i, j);
        } else {
            updateStatus(`${valJ} >= Pivot ➔ Giữ nguyên bên phải.`);
            await sleep(delay/2); 
        }
        barsDom[j].classList.remove("comparing");
    }
    updateStatus("Đưa Pivot vào đúng vị trí giữa.");
    await swap(i + 1, high);
    
    barsDom[high].classList.remove("pivot");
    markSorted(i + 1); 

    for(let k=low; k<=high; k++) if(k != i+1) barsDom[k].classList.remove("sorted"); 
    
    return (i + 1);
}

// 5. Merge Sort
async function mergeSort(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    await checkStop();
    updateStatus(`Gộp hai đoạn: [${start}-${mid}] và [${mid+1}-${end}]`);
    
    const barsDom = document.querySelectorAll(".bar");
    let leftSize = mid - start + 1;
    let rightSize = end - mid;
    
    let leftArr = [], rightArr = [];

    for (let i = 0; i < leftSize; i++) leftArr.push(getValue(barsDom[start + i]));
    for (let i = 0; i < rightSize; i++) rightArr.push(getValue(barsDom[mid + 1 + i]));
    
    let i = 0, j = 0, k = start;
    
    while (i < leftSize && j < rightSize) {
        await checkStop();
        barsDom[k].classList.add("comparing");
        
        if (leftArr[i] <= rightArr[j]) {
            updateStatus(`Lấy ${leftArr[i]} từ trái điền vào vị trí ${k}`);
            setValue(barsDom[k], leftArr[i]);
            i++;
        } else {
            updateStatus(`Lấy ${rightArr[j]} từ phải điền vào vị trí ${k}`);
            setValue(barsDom[k], rightArr[j]);
            j++;
        }
        await sleep(delay);
        barsDom[k].classList.remove("comparing");
        markSorted(k); 
        k++;
    }

    while (i < leftSize) {
        await checkStop();
        barsDom[k].classList.add("comparing");
        setValue(barsDom[k], leftArr[i]);
        await sleep(delay);
        barsDom[k].classList.remove("comparing");
        markSorted(k);
        i++; k++;
    }
    while (j < rightSize) {
        await checkStop();
        barsDom[k].classList.add("comparing");
        setValue(barsDom[k], rightArr[j]);
        await sleep(delay);
        barsDom[k].classList.remove("comparing");
        markSorted(k);
        j++; k++;
    }
}


// --- MAIN CONTROLLER ---

async function runSort() {
    if (isRunning) return;
    isRunning = true;
    shouldStop = false;
    
    const algo = document.getElementById("algoSelect").value;

    const barsDom = document.querySelectorAll(".bar");
    barsDom.forEach(b => b.classList.remove("sorted"));

    try {
        if (algo === "bubble") await bubbleSort();
        if (algo === "selection") await selectionSort();
        if (algo === "insertion") await insertionSort();
        if (algo === "quick") await quickSort(0, bars.length - 1);
        if (algo === "merge") await mergeSort(0, bars.length - 1);
        
        updateStatus("<b>Hoàn thành!</b> Mảng đã được sắp xếp.", "highlight");
    } catch (err) {
        if (err.message === "STOPPED") {
            updateStatus("Đã dừng thuật toán.");
        } else {
            console.error(err);
        }
    } finally {
        isRunning = false;
    }
}

// Sự kiện
sizeSlider.oninput = resetAndGenerate;
speedSlider.oninput = function() {
    // Giá trị slider càng lớn -> delay càng nhỏ (chạy càng nhanh)
    // 201 - 200 = 1ms (nhanh nhất), 201 - 1 = 200ms (chậm nhất)
    delay = 205 - parseInt(this.value); 
};

resetAndGenerate();
updateCodeDisplay();