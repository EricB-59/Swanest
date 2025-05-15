export interface Preferences{
    minAge: number,
    maxAge: number,
    province?: string,
    gender: string,
}

export interface getPreferences{
    age_min: number,
    age_max: number,
    province: {
        name: string
    },
    gender: {
        name: string
    }
}