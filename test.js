const { createServer } = require('http')
const { MongoClient } = require(`mongodb`)

const connectionString = 'mongodb+srv://Ba6aka:WXiPOPVXIxilNNG3@cluster0.tpqf74d.mongodb.net/?retryWrites=true&w=majority'

async function connectToMongoDb() {
    const client = new MongoClient(connectionString, options)

    await client.connect()

    words = client.db('CRUD').collection('words')
    return { client, words }
}

const options = { serverApi: { version: '1', strict: true, deprecationErrors: true } }
const port = process.env.PORT || 1337

letStart().then(handleServer)

async function handleServer({ server, mongo }) {
    server.off('request', preLoadRequest)
    
    server.on('request', async (request, response) => {
        const method = request.method

        if (method !== 'GET') {
            request.body = await getBody(request)
        }

        if (request.url.startsWith('/api/')) {
            handleApi(request, response, mongo)
        }

        else {
            serveFile(request, response)
        }
    })
}

async function serveFile(request, response) {
    const path = "public/" + (request.url.slice(1) || "index.html")
    const extension = path.match(/\.([^.\/\\]+)$/)?.[1]
    const type = typeDictionary[extension]
    if (type) response.setHeader('Content-Type', type)


    createReadStream(path).pipe(response)
}

// function handleApi(request, response, { words }) {
//     const { url } = request
//     let file

//     if (url.includes('getWord')) {
//         getDescriptionPage(words, request, response)
//     } else if (url.includes('getAllWords')) {
//         getAllWords(words, response)
//     } else if (url.includes('updateWord')) {
//         updateWord(words, request, response)
//     } else if (url.includes('deleteWord')) {
//         deleteWord(words, request, response)
//     } else if (url.includes('addWord')) {
//         addWord(words, request, response)
//     }

// }

async function letStart() {
    const [mongo, server] = await Promise.all([
        connectToMongoDb(),
        startServer(),
    ])

    return { mongo, server }
}



async function startServer() {
    return new Promise((resolve, reject) => {
        const server = createServer()

        server.on('request',)

        server.listen(port, () => {
            console.log(`server started at ${port}`)
            resolve(server)
        })
    })

}

