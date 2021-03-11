class Network {
    constructor({ host }) {
        this.host = host
    }

    parseManifestURL({
        url,
        fileResolution,
        fileResolutionTag,
        hostTag
    }) {
        return url
            .replace(fileResolutionTag, fileResolution)
            .replace(hostTag, this.host)
    }

    async fetchFile(url) {
        const response = await fetch(url, { mode: 'cors', headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Methods'
        } })
        return response.arrayBuffer()
    }

    async getProperResolution(url) {
        const startMs = Date.now()
        const response = await fetch(url, { mode: 'cors', headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Methods'
        } })
        await response.arrayBuffer()
        const endMs = Date.now()
        const durationInMs = (endMs - startMs)

        // Ao invés de calcular o throughput, vamos calcular pelo tempo
        const resolutions = [
            // Pior cenário possível, 20 segundos
            { start: 3001, end: 20000, resolution: 144 },
            // Até 3 segundos
            { start: 901, end: 3000, resolution: 360 },
            // Menos de 1 segundo
            { start: 0, end: 900, resolution: 720 },
        ]

        const item = resolutions.find(item => {
            return item.start <= durationInMs && item.end >= durationInMs
        })

        const LOWEST_RESOLUTION = 144

        // Se for mais de 30 segundos
        if (!item) return LOWEST_RESOLUTION

        return item.resolution
    }
}