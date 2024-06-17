export function formatDate(dateString: any): string {
    if (!dateString) {
        console.warn('Invalid dateString:', dateString);
        return ''; // Проверка на null или undefined
    }

    const date = new Date(dateString); // Преобразование строки в объект Date
    if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return ''; // Проверка на допустимость даты
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы с 0 до 11
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}


export function checkRecords(item: any, trafficData: any[], nextTrafficData: any[]): boolean {
    // Преобразование item в Date, если это необходимо
    const itemDate = new Date(item);
    // console.log("itemDate: ", itemDate);

    if (isNaN(itemDate.getTime())) {
        console.error("неверный формат даты доверенности: ", itemDate);
        return true;  // Возврат true, если дата недействительна
    }

    const dateSet = new Set([formatDate(itemDate)]);
    // console.log("раннее выданная доверенность: ", dateSet);

    let counter = 0;
    for (let i = 0; i < trafficData.length; i++) {
        if (counter > 0) counter++;

        // Преобразование trafficData[i].day_title в Date
        const trafficDate = new Date(trafficData[i].day_title);
        if (isNaN(trafficDate.getTime())) {
            // console.log(": ", trafficData[i].day_title);
            continue;  // Пропустить недействительные даты
        }

        if (itemDate.getTime() < trafficDate.getTime()) counter++;
    }

    if (counter < 3)
        counter += nextTrafficData.length;
    console.log(counter)

    return counter > 2;
}
