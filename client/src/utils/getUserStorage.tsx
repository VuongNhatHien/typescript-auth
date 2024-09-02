const getUserStorage = () => {
    const temp: string | null = localStorage.getItem("user")

    if (!temp) {
        console.log("No record in local storage")
        return null
    }
    return JSON.parse(temp)
}

export default getUserStorage