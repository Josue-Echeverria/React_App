# Conexión pool en python con tamaño dinamico
Integrantes:
- Luis Urbina
- Josue Echeverria
- Carlos Venegas

## Librerias

- **SQLAlchemy**: Es una herramienta que controla cuántas conexiones a la base de datos pueden existir al mismo tiempo, cuántas pueden ser creadas de forma dinámica cuando el pool alcanza su capacidad máxima, y cuánto tiempo pueden vivir esas conexiones antes de cerrarse o reciclarse.

- **psycopg2**: Es un adaptador para conectar aplicaciones Python a bases de datos PostgreSQL. Ofrece connection pooling para gestionar eficientemente las conexiones, permitiendo gestionar cuántas conexiones pueden existir al mismo tiempo. Crea nuevas conexiones dinámicamente si todas están ocupadas


- **aiomysql** o **aiopg**:  Son ibrerías que ayudan a manejar conexiones a bases de datos MySQL y PostgreSQL de manera asincrónica en Python. Permiten que las aplicaciones puedan realizar operaciones con la base de datos sin bloquear el flujo asincrónico, lo cual es ideal para entornos de alta concurrencia


## Parametros SQLAlchemy

### Parámetros configurables:
1. **poolclass**: Permite especificar una clase personalizada para gestionar el pool de conexiones. Puedes usar diferentes tipos de pools, como NullPool (sin pool), StaticPool, o QueuePool.
- NullPool: No utiliza ningún tipo de connection pooling. Esto significa que cada vez que se necesita una conexión, se abre una nueva conexión y se cierra tan pronto como se termina de usarla.
-  StaticPool: Reutiliza una única conexión en todas las operaciones de la base de datos. Esto significa que, en lugar de crear múltiples conexiones, todas las solicitudes utilizan la misma conexión.
- QueuePool: es el pool de conexiones predeterminado en SQLAlchemy. Es un tipo de pool que gestiona un conjunto de conexiones abiertas y las reutiliza cuando es necesario.

2. **pool_size**: Número inicial de conexiones en el pool. Es decir, cuántas conexiones deben estar abiertas y disponibles desde el inicio.
3. **max_overflow**: Cuántas conexiones adicionales se pueden crear cuando el pool está lleno. Esto es útil cuando hay picos de demanda en la aplicación.
4. **pool_timeout**: Indica el tiempo máximo que la aplicación esperará para obtener una conexión del pool. Si se excede este tiempo, la operación fallará y lanzará una excepción.
5. **pool_recycle**: Establece el número de segundos después de los cuales una conexión es reciclada, es decir, cerrada y reemplazada por una nueva.

## Código de Ejemplo

```python

# Importa la función create_engine de SQLAlchemy, que permite crear una conexión con la base de datos
from sqlalchemy import create_engine
# QueuePool, una clase que gestiona un pool de conexiones para reutilizarlas de forma eficiente
from sqlalchemy.pool import QueuePool

# Motor de conexión a la base de datos PostgreSQL (puede ser MySQL, SQLite, etc.)
engine = create_engine(
    'postgresql://me@localhost/basedatos',
    poolclass=QueuePool # Especifica que queremos usar QueuePool para el manejo de conexiones
    pool_size=5,         # Crea 5 conexiones al inicio
    max_overflow=10,      # Permite crear hasta 10 conexiones adicionales si las 5 están ocupadas
    pool_timeout=30,      # Espera hasta 30 segundos por una conexión antes de fallar
    pool_recycle=3600     # Recicla conexiones después de 1 hora de uso continuo
)

# Usar la conexión del pool en un bloque de código
with engine.connect() as connection:
    # Ejecuta una consulta SQL
    result = connection.execute("SELECT * FROM usuarios")
    # Itera sobre los resultados obtenidos de la base de datos
    for row in result:
        print(row) 

```

## Bondades

- **Optimización de recursos**: Al usar un pool de conexiones, no es necesario crear una nueva conexión cada vez que la aplicación necesite acceso a la base de datos, lo que ahorra tiempo y recursos del sistema.

- **Escalabilidad dinámica**: SQLAlchemy permite que el tamaño del pool crezca dinámicamente cuando hay más demanda, lo que ayuda que se pueda manejar picos de tráfico sin comprometer la estabilidad de la aplicación.

## Problema o limitante

**Manejo de entornos asíncronos**: SQLAlchemy no tiene soporte nativo para entornos asíncronos. Si se esta desarrollando una aplicación basada en async, es necesario usar librerías adicionales, como asyncpg o aiomysql, lo cual introduce más complejidad al código.