import Head from 'next/head'
import { useRef, useState } from 'react'
import { formatDate } from '../utils/formatDate'

import { trpc } from '../utils/trpc'

export default function IndexPage() {
  const msg = trpc.msg

  const [newMessage, setNewMessage] = useState('')

  const { data } = msg.list.useQuery()

  const mutation = msg.add.useMutation()

  const ctx = trpc.useContext()

  const chatBoxRef = useRef<HTMLDivElement>(null)
  if (!data) {
    return (
      <div>
        <Head>
          <title>Loading...</title>
        </Head>
        <h1>Loading...</h1>
      </div>
    )
  }

  const allMessages = formatDate(data)
  const scrollToLastMessage = () => {
    const lastChild = chatBoxRef.current?.lastElementChild
    lastChild?.scrollIntoView({
      block: 'end',
      inline: 'end',
      behavior: 'smooth',
    })
  }
  const createMessage = (input: string) => {
    input = input.trim()
    if (input.length < 1) return

    mutation.mutate(
      { text: input },
      {
        onSuccess: () => {
          ctx.msg.list.invalidate()
        },
      }
    )
    setNewMessage('')
    setTimeout(() => {
      scrollToLastMessage()
    }, 1500)
  }

  return (
    <div>
      <Head>
        <title>chatApp | Gabriel</title>
      </Head>

      <div className='chatbox'>
        <div className='screen' ref={chatBoxRef}>
          {allMessages.map((msg) => {
            return (
              <div key={msg.id}>
                <div className='msg-list'>
                  <div className='messenger-container'>
                    <p>
                      {msg.text}
                      <br />
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'gray',
                          display: 'flex',
                          marginTop: '4px',
                        }}
                      >
                        {msg.createdAt}
                      </span>
                    </p>
                  </div>
                </div>
                <div className='clear'></div>
              </div>
            )
          })}
        </div>
        <div className='input'>
          <input
            type='text'
            style={{
              height: '80%',
              borderColor: '1px solid grey',
              fontSize: '22px',
              paddingLeft: '7px',
            }}
            placeholder='Enter message ...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={({ code }) =>
              code === 'Enter' && createMessage(newMessage)
            }
          />
        </div>
        <div className='btn-box'>
          <button
            className='btn'
            style={{
              height: '80%',
              backgroundColor: 'blueviolet',
              borderColor: 'white',
              fontSize: '23px',
              color: 'whitesmoke',
              borderRadius: '4px',
              fontFamily: 'sans-serif',
              letterSpacing: '.5px',
            }}
            onClick={() => createMessage(newMessage)}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  )
}
