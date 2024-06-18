// Saber si un value se encuentra en la lista de un select
const existsKeySelect = (arrayList: any[], key: string, value: string) => {
    const result = arrayList.filter((item) => item[`${key}`] === value);
    return result.length > 0;
 }
 
 const transformDate = (fecha:string) => {
   return fecha.substring(6, 10) + "-" + fecha.substring(3, 5) + "-" + fecha.substring(0, 2);
 }
 
 const obtenerColoresAleatorios = (cantidad: number): { fondo: string, borde: string }[] => {
   const coloresAleatorios: { fondo: string, borde: string }[] = [];
 
   const coloresParaGrafico = [
     { fondo: "#B2DFDB", borde: "#80CBC4" },
     { fondo: "#FFCC80", borde: "#FFAB40" },
     { fondo: "#FFD180", borde: "#FFAB40" },
     { fondo: "#E6EE9C", borde: "#C5E1A5" },
     { fondo: "#FFE0B2", borde: "#FFD54F" },
     { fondo: "#CE93D8", borde: "#9575CD" },
     { fondo: "#FFAB91", borde: "#FF8A65" },
     { fondo: "#80CBC4", borde: "#4DB6AC" },
     { fondo: "#90CAF9", borde: "#42A5F5" },
     { fondo: "#FFD54F", borde: "#FFC107" },
     { fondo: "#A5D6A7", borde: "#66BB6A" },
     { fondo: "#FFAB40", borde: "#FF9100" },
     { fondo: "#81C784", borde: "#66BB6A" },
     { fondo: "#9FA8DA", borde: "#5C6BC0" },
     { fondo: "#FF8A65", borde: "#E57373" },
     { fondo: "#4DB6AC", borde: "#009688" },
     { fondo: "#64B5F6", borde: "#1976D2" },
     { fondo: "#FFD740", borde: "#FFC107" },
     { fondo: "#81C0C5", borde: "#4DD0E1" },
     { fondo: "#FF7043", borde: "#E64A19" }
   ];
   
   for (let i = 0; i < cantidad; i++) {
     const indiceAleatorio = Math.floor(Math.random() * coloresParaGrafico.length);
     coloresAleatorios.push(coloresParaGrafico[indiceAleatorio]);
   }
 
   return coloresAleatorios;
 }
 
 export {
   existsKeySelect,
   transformDate,
   obtenerColoresAleatorios
 }