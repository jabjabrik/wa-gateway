import schedule from 'node-schedule';

const scheduledJobs = [];

export const setScheduleTask = (schedules, cb) => {
    // *Validate input
    const validateResults = [];
    schedules.forEach(({ jam_mulai: hour, hari: day, no_hp: whatsapp }) => {
        const hourArr = hour.split(':');
        const cronDay = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'].indexOf(day.toLowerCase());

        if (cronDay === -1) {
            validateResults.push(`Hari '${day}' tidak valid. Harap gunakan nama hari dalam bahasa Indonesia.`);
        }

        if (hourArr.length !== 2) {
            validateResults.push(`Format waktu '${hour}' tidak valid. Harap gunakan format 'HH:MM'.`);
        }

        const cronHour = parseInt(hourArr[0], 10);
        const cronMinute = parseInt(hourArr[1], 10);

        if (isNaN(cronHour) || isNaN(cronMinute) || cronHour < 0 || cronHour > 23 || cronMinute < 0 || cronMinute > 59) {
            validateResults.push(`Waktu '${hour}' tidak valid. Harap gunakan format 'HH:MM' dengan jam dalam rentang 0-23 dan menit dalam rentang 0-59.`);
        }
    })
    if (validateResults.length) return validateResults

    // *set schedules
    const scheduleResult = []
    schedules.forEach(data => {
        const { jam_mulai: _hour, hari: _day, no_hp: whatsapp } = data
        const jakartaTimezone = 'Asia/Jakarta';
        const [hour, minute] = _hour.split(':')
        const day = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'].indexOf(_day.toLowerCase());
        const params = { hour, minute, dayOfWeek: day, tz: jakartaTimezone }
        const job = schedule.scheduleJob(params, () => {
            console.log(`Tugas dijadwalkan pada hari ${day}, pukul ${hour}:${minute} WIB sudah berjalan.`);
            setTimeout(() => cb(data), 1000);
        });
        scheduledJobs.push(job);
        scheduleResult.push(`Tugas dijadwalkan dengan no ${whatsapp} untuk hari ${_day}, pukul ${hour}:${minute} WIB.`)
        console.log(`Tugas dijadwalkan dengan no ${whatsapp} untuk hari ${_day}, pukul ${hour}:${minute} WIB.`)
    })

    return scheduleResult
}

export const resetAllSchedules = () => {
    for (const job of scheduledJobs) {
        schedule.cancelJob(job)
    }
    scheduledJobs.length = 0;
};