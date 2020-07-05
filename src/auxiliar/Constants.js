export const userCsvToJsonMap = {
    dni: 'personalData.dni',
    firstName: 'personalData.firstName',
    lastName: 'personalData.lastName',
    email: 'personalData.email',
    cellPhone: 'personalData.cellPhone',
    cuitNumber: 'jobDetail.cuitNumber',
    category: 'jobDetail.category',
    grade: 'jobDetail.grade',
    dedication: 'jobDetail.dedication',
    contractRelation: 'jobDetail.contractRelation',
    aditionalHours: 'jobDetail.aditionalHours',
    cvURL: 'jobDetail.cvURL',
    lastUpdate: 'jobDetail.lastUpdate',
    gradeTitles: 'jobDetail.gradeTitles',
    posGradeTitles: 'jobDetail.posGradeTitles'
};

export const studentsCsvToJsonMap = {
    fileNumber: 'fileNumber',
    dni: 'personalData.dni',
    firstName: 'personalData.firstName', 
    lastName: 'personalData.lastName', 
    email: 'personalData.email',
    cellPhone: 'personalData.cellPhone'
};

export const CategoryOptions = ['', 'Auxiliar', 'Intructor/a', 'Adjunto/a', 'Asociado/a', 'Titular', 'Emérito/a', 'Consulto/a']
export const GradeOptions = ['', 'A', 'B']
export const ContractOptions = ['', 'Contratado/a', 'Interino/a', 'Ordinario/a']
export const DedicationOptions = ['', 'Parcial', 'Semi-Exclusiva', 'Exclusiva']

export const SeasonOptions = ['1C', '2C', '3C', '1T', '2T', '3T', '4T', '1S', '2S']
export const ShiftOptions = ['Mañana', 'Tarde', 'Noche']

export const emptyUser = {
    isActive: true,
    personalData: {
        dni: '',
        firstName: '',
        lastName: '',
        email: '',
        cellPhone: '' 
    },
    jobDetail: {
        cuitNumber: '',
        category: '',
        grade: '',
        dedication: '',
        contractRelation: '',
        aditionalHours: 0,
        cvURL: '',
        lastUpdate: '',
        gradeTitles: '',
        posGradeTitles: ''
    },
    coordinatedSubjects: [],
    taughtCourses: []
};

export const emptyCourse = {
    courseCode: '',
    courseShift: '',
    courseIsOpen: '',
    courseYear: 0,
    courseSeason: '',
    courseLocation: '',
    subject: {
        code: ''
    },
    students: [],
    teachers: []
};

export const emptyNewCourse = {
    courseCode: '',
    courseShift: '',
    courseIsOpen: true,
    courseYear: 2020,
    courseSeason: '',
    courseLocation: '',
    subject: {
        code: '',
        name: ''
    },
    students: [],
    lessons: [],
    teachers: [],
    evaluations: []
};

export const profileUser = {
    birthDate: "",
    data: {}, // not used
    email: "",
    firstName: "",
    fullName: "", // Autoconstruct lastName, firstName
    imageUrl: "",
    lastName: "",
    middleName: "", // Not Used
    mobilePhone: "",
    passwordChangeRequired: false,
    preferredLanguages: [], // this property always concats to the list (PATCH method bug on FusionAuth)
    timezone: "Etc/GMT-3", // not change
    twoFactorDelivery: "None", // not used
    twoFactorEnabled: false, // not used
    usernameStatus: "", // not used
    username: ""
};

export const emptyStudent = {
    fileNumber: 0,
    personalData: {
      // personalDataId: 0,
      dni: 0,
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: ''
    },
    takenCourses: [],
    attendedLessons: []
};

export const emptySubject = {
    code: '',
    name: '',
    acronym: '',
    programURL: ''
};

export const parserConfig = {
    delimiter: "",  // auto-detect
    newline: "",  // auto-detect
    quoteChar: '"',
    escapeChar: '"',
    header: true,
    transformHeader: undefined,
    dynamicTyping: true,
    preview: 0,
    encoding: "",
    worker: true,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    downloadRequestHeaders: undefined,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined,
    delimitersToGuess: [',', '	', '|', ';']
};

export function newEvalInstance() {
    return {
        evaluationId: '',
        instanceName: 'TP ',
        califications: []
    }
}

export const initialStudent = () => { return { personalData: {} } }

export const initialUser = () => { return { isActive: true, personalData: {}, jobDetail: {} } }