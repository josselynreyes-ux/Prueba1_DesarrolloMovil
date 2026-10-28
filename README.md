# UrbanInspect

Aplicación móvil desarrollada con Ionic y Angular para registrar, consultar y realizar el seguimiento de incidencias urbanas, como baches, problemas de alumbrado, daños en parques y alcantarillas obstruidas.

## 1. Tecnologías utilizadas

- **Ionic:** permite crear las pantallas, los botones y los formularios de la aplicación.
- **Angular:** organiza las páginas y controla las acciones que realiza el usuario.
- **TypeScript:** permite escribir la lógica de la aplicación de forma ordenada.
- **Capacitor:** permite ejecutar la aplicación en Android y utilizar funciones del celular.
- **MockAPI:** permite almacenar y consultar las incidencias registradas.
- **Open-Meteo:** proporciona información meteorológica y datos relacionados con la lluvia.
- **HTML y SCSS:** permiten organizar el contenido y dar estilo a las pantallas.

## 2. Dependencias utilizadas

| Dependencia | Función |
|---|---|
| `@ionic/angular` | Crear las pantallas y los componentes visuales. |
| `@angular/core` | Controlar el funcionamiento de la aplicación. |
| `@angular/forms` | Capturar y validar los datos ingresados en los formularios. |
| `@angular/router` | Permitir la navegación entre las pantallas. |
| `@capacitor/core` | Conectar la aplicación con las funciones del dispositivo. |
| `@capacitor/android` | Permitir la ejecución de la aplicación en Android. |
| `@capacitor/camera` | Tomar fotografías y seleccionar imágenes. |
| `@capacitor/geolocation` | Obtener las coordenadas del dispositivo. |

También se utiliza `fetch`, una función de JavaScript que permite enviar y recibir información de los servicios externos.

> Para consultar todas las dependencias y sus versiones exactas, se puede revisar el archivo `package.json`.

## 3. Servicios externos utilizados

### 3.1. MockAPI

Se utiliza para almacenar, consultar y actualizar la información de las incidencias.

**URL del servicio:**

https://6ae15825be3bc8fead9869dc.mockapi.io/incidencias

### 3.2. Open-Meteo

Se utiliza para consultar información meteorológica según la ubicación y el período requerido.

**URL de la API:**

https://api.open-meteo.com/v1/forecast

Si la lluvia supera los 5 mm, la aplicación muestra una advertencia al usuario. Esta advertencia no impide registrar la incidencia. Si el servicio meteorológico no está disponible, el registro puede continuar.

## 4. Requisitos para ejecutar el proyecto

Antes de comenzar, se necesita tener instalado:

- Node.js y npm.
- Ionic CLI.
- Android Studio para ejecutar la aplicación en Android.
- Un celular Android o un emulador para realizar las pruebas.

## 5. Instrucciones de ejecución

### 5.1. Descargar el proyecto

Clonar el repositorio desde GitHub:

```bash
git clone Prueba1_DesarrolloMovil
```

Ingresar a la carpeta del proyecto:

```bash
cd UrbanInspect
```

### 5.2. Instalar las dependencias

Ejecutar el siguiente comando dentro de la carpeta del proyecto:

```bash
npm install
```

Este comando instala las dependencias necesarias para ejecutar la aplicación.

### 5.3. Ejecutar en el navegador

Iniciar la aplicación con:

```bash
ionic serve
```

La aplicación se abrirá en el navegador. Esta opción permite revisar las pantallas y probar gran parte de las funciones, aunque algunas funciones del celular, como la cámara y la ubicación, pueden comportarse de manera diferente.

### 5.4. Ejecutar en Android

Primero, generar la versión actualizada de la aplicación:

```bash
ionic build
```

Después, sincronizar los cambios con el proyecto Android:

```bash
npx cap sync android
```

Finalmente, abrir el proyecto en Android Studio:

```bash
npx cap open android
```

Desde Android Studio se puede ejecutar la aplicación en un celular conectado por USB o en un emulador.

Se recomienda probar la cámara y la ubicación en un dispositivo Android para comprobar su funcionamiento y la solicitud de permisos.

## 6. Funcionalidades implementadas

### 6.1. Registro de incidencias

Se utiliza un formulario para registrar el tipo de problema, su descripción, dirección, sector y prioridad.

Los campos obligatorios se validan antes de guardar la información para evitar registros incompletos.

### 6.2. Fotografías

Se utiliza `@capacitor/camera` para tomar fotografías desde el dispositivo. También se permite seleccionar una imagen de la galería.

La fotografía se muestra como vista previa antes de guardar la incidencia y se puede retirar si el usuario desea cambiarla.

### 6.3. Ubicación

Se utiliza `@capacitor/geolocation` para obtener las coordenadas del dispositivo.

En las incidencias de tipo bache, la ubicación es obligatoria. Para otros tipos de incidencias es opcional.

Si no se puede obtener la ubicación automáticamente, se pueden ingresar las coordenadas manualmente.

### 6.4. Consulta y paginación de incidencias

Se utiliza MockAPI para obtener las incidencias y mostrar sus características, como descripción, dirección, sector, fecha, prioridad, estado y fotografía.

La lista permite cargar más registros mediante la paginación, evitando mostrar todos los resultados en una sola carga.

### 6.5. Seguimiento local

El usuario puede marcar las incidencias que desea seguir y consultar únicamente esas incidencias.

La selección se guarda localmente en el dispositivo para conservarla después de cerrar y volver a abrir la aplicación. Este seguimiento no modifica el estado general de la incidencia en el servidor.

### 6.6. Información meteorológica

Se consulta Open-Meteo para obtener información meteorológica y la lluvia registrada durante la hora anterior.

Cuando la lluvia supera los 5 mm, se muestra una advertencia para la demostración de esta condición se modificó temporalmente la precipitacion a >=0 y asi poder demostrar el mensaje. Esta condición no bloquea el registro de la incidencia.

Si el servicio meteorológico no está disponible, el usuario puede continuar con el registro.

<img width="1495" height="625" alt="image" src="https://github.com/user-attachments/assets/60b9d493-02f5-4c24-9b0b-88ca07948ad9" />


### 6.7. Guardado de borradores

Se permite guardar temporalmente los datos de una incidencia para recuperarlos si el usuario sale del formulario o vuelve a abrir la aplicación.

Esto evita tener que ingresar nuevamente toda la información cuando el registro todavía no se ha terminado.

### 6.8. Actualización de estados

Las incidencias pueden avanzar por los siguientes estados:

- **Pendiente:** la incidencia todavía no se ha atendido.
- **En proceso:** se está trabajando en su solución.
- **Resuelta:** el problema se ha solucionado.

Una incidencia resuelta no puede volver a un estado anterior. Además, se solicita una observación para registrar su resolución.

### 6.9. Manejo de errores

Se muestran mensajes cuando ocurre un problema al consultar los datos, cuando no existen incidencias para mostrar o cuando una operación necesita volver a intentarse.

Esto ayuda al usuario a comprender qué ocurrió y qué puede hacer a continuación.

## 7. Permisos de Android

Los siguientes permisos se declaran en el archivo `AndroidManifest.xml`. Cada uno permite que la aplicación utilice una función específica del dispositivo.

### 7.1. Ubicación aproximada

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

Permite solicitar una ubicación aproximada del dispositivo. Es útil cuando no se necesita conocer la posición exacta del usuario.

### 7.2. Ubicación precisa

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Permite solicitar una ubicación más precisa mediante los servicios de ubicación del dispositivo.

En UrbanInspect es importante para registrar las coordenadas de los baches y facilitar su localización.

Ambos permisos permiten solicitar distintos niveles de precisión. Android puede ofrecer al usuario la opción de compartir una ubicación aproximada o precisa.

### 7.3. Acceso a la cámara

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

Permite solicitar acceso a la cámara del dispositivo para tomar fotografías de las incidencias. Estas fotografías sirven como evidencia visual del problema registrado.

### 7.4. Cámara opcional

```xml
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

Indica que la cámara no es obligatoria para instalar la aplicación.

Se utiliza `required="false"` porque UrbanInspect también permite seleccionar fotografías de la galería. De esta manera, los dispositivos sin cámara no quedan excluidos automáticamente de la instalación.

**Importante:** declarar los permisos en el archivo de Android no significa que el usuario los haya concedido. La aplicación debe gestionar las solicitudes de permisos y mostrar mensajes adecuados cuando el acceso sea denegado.

## 8. Justificación de las decisiones técnicas

| Decisión | Justificación |
|---|---|
| Utilizar Ionic y Angular | Permite construir las pantallas y organizar el funcionamiento de la aplicación con herramientas que trabajan juntas. |
| Utilizar Capacitor | Facilita el acceso a funciones del celular, como la cámara y la ubicación. |
| Utilizar MockAPI | Permite guardar y consultar incidencias sin tener que crear un servidor propio para esta prueba. |
| Utilizar Open-Meteo | Permite consultar información meteorológica real en lugar de utilizar datos inventados. |
| Permitir coordenadas manuales | Ofrece una alternativa cuando la ubicación automática no funciona o el usuario no concede el permiso. |
| Guardar el seguimiento localmente | Permite conservar las selecciones del usuario sin modificar los datos compartidos de las incidencias. |
| Utilizar borradores | Ayuda a evitar la pérdida de los datos ingresados cuando el formulario todavía no está terminado. |
| Mostrar advertencias sin bloquear el registro | Informa sobre condiciones de lluvia importantes sin impedir que se registre un problema urbano. |
| Permitir fotografías de la galería | Ofrece una alternativa cuando el usuario no puede o no desea tomar una fotografía directamente con la cámara. |
| Utilizar permisos de ubicación y cámara | Permite solicitar acceso a las funciones del dispositivo que necesita la aplicación. |

## 9. Consideraciones

- Se necesita conexión a internet para consultar MockAPI y Open-Meteo.
- La cámara y la ubicación deben probarse en Android para verificar su funcionamiento en el dispositivo.
- La disponibilidad de la ubicación depende de los permisos concedidos y de los servicios de ubicación del teléfono.
- Los datos de seguimiento guardados localmente son independientes de los registros almacenados en MockAPI.
- MockAPI se utiliza como servicio de prueba y no sustituye un servidor preparado para un sistema en producción.
- Si el usuario deniega un permiso, la aplicación debe informar sobre la situación y ofrecer alternativas cuando sea posible.

## 10. Conclusión

UrbanInspect permite registrar, consultar y dar seguimiento a incidencias urbanas desde una aplicación móvil. Integra servicios externos para almacenar información y consultar el clima, junto con funciones del dispositivo para capturar fotografías y obtener coordenadas.

Las decisiones tomadas buscan que la aplicación sea comprensible, fácil de utilizar y capaz de ofrecer alternativas cuando alguna función del dispositivo o servicio externo no esté disponible.

## 11. APK
[UrbanInspect.zip](https://github.com/user-attachments/files/34087867/UrbanInspect.zip)
