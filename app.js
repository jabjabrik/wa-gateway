import express from 'express';
import bodyParser from 'body-parser'
import { client } from './src/utils/whatsapp.js';
import { resetAllSchedules, setScheduleTask } from './src/utils/cron.js';

const app = express()
const PORT = process.env.PORT || 3001

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/set', (req, res) => {
    const outputArray = [];
    for (const key in req.body) {
        outputArray.push(req.body[key]);
    }
    const resultSchedules = startJob(outputArray)
    res.json({ status: 'Oke', message: resultSchedules })
})

const startJob = (schedules) => {
    resetAllSchedules()
    const resultSchedules = setScheduleTask(schedules, (data) => {
        const { jam_mulai, jam_selesai, nama_guru, nama_kelas, mata_pelajaran, no_hp, hari, jurusan } = data
        const whatsappNumber = `62${no_hp.slice(1)}@c.us`
        const msg = `Halo ${nama_guru},\n\nAnda memiliki jadwal mengajar untuk ${nama_kelas} jurusan ${jurusan} pada mata pelajaran ${mata_pelajaran}.\nHari: ${hari}\nJam Mulai: ${jam_mulai}\nJam Selesai: ${jam_selesai}\n\nTerima kasih.`
        client.sendMessage(`${whatsappNumber}`, msg);
    })
    return resultSchedules
}

client.initialize();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))