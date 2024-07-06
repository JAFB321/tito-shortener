export class UrlID {
  CHARACTERS = 'a6Ep2dBWA7M8k9zmJe3ycXFLQZDs5ulP4YjioKRwUrtnGqbhHxOvT1Cf0SVgNI'
  BASE = 62

  constructor({ idNumber, idString }) {
    if (idNumber && idString) throw new Error('Cannot have both idNumber and idString')
    if (!idNumber && !idString) throw new Error('Must have either idNumber or idString')

    this.idNumber = Number(idNumber)
    this.idString = idString

    if (this.idNumber && !Number.isInteger(this.idNumber)) throw new Error('idNumber must be an integer')
    // if (this.idString && this.CHARACTERS.split('').some((c) => !this.idString.includes(c))) throw new Error('idString contains invalid characters')
  }

  static fromNumber(idNumber) {
    return new UrlID({ idNumber })
  }

  static fromString(idString) {
    return new UrlID({ idString })
  }

  /** Get base 10 number */
  getNumber() {
    if (this.idNumber) return this.idNumber

    let idNumber = 0
    for (let i = 0; i < this.idString.length; i++) {
      idNumber = idNumber * this.BASE + this.CHARACTERS.indexOf(this.idString[i])
    }

    return idNumber
  }

  /**
   * Get base N string number
   * @returns {string}
   * */
  getString() {
    if (this.idString) return this.idString

    let idString = ''
    let idNumber = this.idNumber
    while (idNumber > 0) {
      idString = this.CHARACTERS[idNumber % this.BASE] + idString
      idNumber = Math.floor(idNumber / this.BASE)
    }

    return idString
  }

  /** Get next ID++ */
  next() {
    return new UrlID({ idNumber: this.getNumber() + 1 })
  }
}
