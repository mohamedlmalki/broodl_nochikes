'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import { useRouter } from 'next/navigation';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });


export default function Dashboard() {
    const { currentUser, userDataObj, setUserDataObj, loading } = useAuth()
    const router = useRouter()
    const [data, setData] = useState({})
    const now = new Date()

    useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/login')
        }
    }, [currentUser, loading, router])

    function countValues() {
        let total_number_of_days = 0
        let sum_moods = 0
        for (let year in data) {
            for (let month in data[year]) {
                for (let day in data[year][month]) {
                    let days_mood = data[year][month][day]
                    total_number_of_days++
                    sum_moods += days_mood
                }
            }
        }
        const avg = sum_moods / total_number_of_days;
        return { num_days: total_number_of_days, average_mood: isNaN(avg) ? 0 : avg.toFixed(1) }
    }

    const statuses = {
        ...countValues(),
        time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
    }

    async function handleSetMood(mood) {
        if (!currentUser) return;
        const day = now.getDate()
        const month = now.getMonth()
        const year = now.getFullYear()

        try {
            const newData = { ...userDataObj }
            if (!newData?.[year]) {
                newData[year] = {}
            }
            if (!newData?.[year]?.[month]) {
                newData[year][month] = {}
            }

            newData[year][month][day] = mood
            // update the current state
            setData(newData)
            // update the global state
            setUserDataObj(newData)
            // update firebase
            const docRef = doc(db, 'users', currentUser.uid)
            await setDoc(docRef, {
                [year]: {
                    [month]: {
                        [day]: mood
                    }
                }
            }, { merge: true })
        } catch (err) {
            console.log('Failed to set data: ', err.message)
        }
    }

    const moods = {
        '&*@#$': '😭',
        'Sad': '😔',
        'Existing': '😶',
        'Good': '😊',
        'Elated': '😍',
    }

    useEffect(() => {
        if (!currentUser || !userDataObj) {
            return
        }
        setData(userDataObj)
    }, [currentUser, userDataObj])

    if (loading || !currentUser) {
        return <Loading />
    }

    return (
        <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
            <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
                {Object.keys(statuses).map((status, statusIndex) => {
                    return (
                        <div key={statusIndex} className=' flex flex-col gap-1 sm:gap-2'>
                            <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
                            <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status]}{status === 'num_days' ? ' 🔥' : ''}</p>
                        </div>
                    )
                })}
            </div>
            <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
                How do you <span className='textGradient'>feel</span> today?
            </h4>
            <div className='flex items-stretch flex-wrap gap-4'>
                {Object.keys(moods).map((mood, moodIndex) => {
                     const moodId = `mood-button-${mood.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                    return (
                        <button 
                            id={moodId}
                            onClick={() => {
                                const currentMoodValue = moodIndex + 1
                                handleSetMood(currentMoodValue)
                            }} 
                            className={'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1 '} 
                            key={moodIndex}
                        >
                            <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
                            <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
                        </button>
                    )
                })}
            </div>
            <Calendar completeData={data} handleSetMood={handleSetMood} />
        </div>
    )
}