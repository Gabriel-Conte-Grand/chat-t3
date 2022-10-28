import { Message } from '@prisma/client'

export const formatDate = (allMessages: Message[]) => {
  const updatedMessages = allMessages.map((msg: Message) => {
    let newDate = new Date().toDateString().slice(0, -5)

    const hours = new Date(msg.createdAt).getHours()
    let minutes = new Date(msg.createdAt).getMinutes().toString()

    if (minutes.toString().length === 1) {
      minutes = '0' + minutes
    }
    newDate = newDate + ', ' + hours + ':' + minutes

    const horaJS = new Date().toLocaleTimeString()
    const mongoAFormatoHora = new Date(msg.createdAt).toLocaleTimeString()

    // if(newDate[0] + newDate[1] === horaJS[0] + horaJS[1]){
    //     const minutes = Number(newDate[2] + newDate[])
    //     return {
    //         ...msg,
    //         createdAt:
    //     }
    // }

    if (mongoAFormatoHora.slice(0, 5) === horaJS.slice(0, 5)) {
      return {
        ...msg,
        createdAt: 'just now',
      }
    }

    if (
      mongoAFormatoHora.slice(0, 2) === horaJS.slice(0, 2) &&
      mongoAFormatoHora.slice(3, 5) !== horaJS.slice(3, 5)
    ) {
      const minMongo = Number(mongoAFormatoHora[3] + mongoAFormatoHora[4])
      const minNow = Number(horaJS[3] + horaJS[4])

      const diff = (minNow - minMongo).toString()
      const resp = diff === '1' ? '1 minute ago' : diff + ' minutes ago'
      return {
        ...msg,
        createdAt: resp,
      }
    }

    return {
      ...msg,
      createdAt: newDate,
    }
  })

  return updatedMessages
}
