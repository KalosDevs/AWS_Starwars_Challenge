interface Planeta {
    id: string;
    nombre: string;              // Ej: "Tierra"
    masaKg: number;              // Masa en kilogramos
    radioKm: number;             // Radio en kilómetros
    distanciaSolKm: number;      // Distancia al Sol en kilómetros
    poseeAnillos: boolean;       // ¿Tiene anillos? true/false
    numeroLunas: number;         // Número de lunas
    atmosfera: string[];         // Componentes de la atmósfera (["N2", "O2"])
    gravedad: number;            // Gravedad en m/s²
  }
  