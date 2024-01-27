/**
 * @description Get local date as string
 *
 * @export
 * @param {Date} inputDate
 * @return {string}
 * @see https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
 */
export function getLocalIsoDateTime(inputDate: Date): string {
    const timeZoneOffset = inputDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(inputDate.getTime() - timeZoneOffset)
        .toISOString()
        .slice(0, -1);

    return localISOTime;
}

/*
if (require.main === module) {
    const s = getLocalIsoDateTime(new Date());
    console.debug(s);
}
*/
