import React, {FC, useState} from 'react';


interface IUseLoading {
    loading: boolean
    startLoading: () => void
    stopLoading: () => void
}
const useLoading = (): IUseLoading => {
    const [loading, setLoading] = useState(false)

    const startLoading = () => {
        setLoading(true)
    }

    const stopLoading = () => {
        setLoading(false)
    }

    return {loading, startLoading, stopLoading}
};

export default useLoading;