export function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export function checkRecords(item: any, trafficData: any[], nextTrafficData: any[]): boolean {
    // Преобразование item в Date, если это необходимо
    const itemDate = new Date(item);
    console.log("itemDate: ", itemDate);

    if (isNaN(itemDate.getTime())) {
        console.error("Invalid date found: ", itemDate);
        return false;  // Возврат false, если дата недействительна
    }

    const dateSet = new Set([formatDate(itemDate)]);
    console.log("раннее выданная доверенность: ", dateSet);

    let counter = 0;
    for (let i = 0; i < trafficData.length; i++) {
        if (counter > 0) counter++;

        // Преобразование trafficData[i].day_title в Date, если это необходимо
        const trafficDate = new Date(trafficData[i].day_title);
        if (isNaN(trafficDate.getTime())) {
            console.error("Invalid traffic date found: ", trafficData[i].day_title);
            continue;  // Пропустить недействительные даты
        }

        if (itemDate.getTime() < trafficDate.getTime()) counter++;
    }

    if (counter < 2)
        counter += nextTrafficData.length;
    console.log(counter)

    return counter > 1;
}
