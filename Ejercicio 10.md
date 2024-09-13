# Conexión pool en python con tamaño dinamico
Integrantes:
- Luis Urbina
- Josue Echeverria
- Carlos Venegas

## Librerias

- **SQLAlchemy**: Es una herramienta que controla cuántas conexiones a la base de datos pueden existir al mismo tiempo, cuántas pueden ser creadas de forma dinámica cuando el pool alcanza su capacidad máxima, y cuánto tiempo pueden vivir esas conexiones antes de cerrarse o reciclarse.

- **psycopg2**: Es un adaptador para conectar aplicaciones Python a bases de datos PostgreSQL. Ofrece connection pooling para gestionar eficientemente las conexiones, permitiendo gestionar cuántas conexiones pueden existir al mismo tiempo. Crea nuevas conexiones dinámicamente si todas están ocupadas


### Parámetros configurables:

1. **minconn**: Número mínimo de conexiones que el pool debe mantener abiertas. Esto asegura que siempre haya un número mínimo de conexiones disponibles para ser reutilizadas. (Aunque se use menos conexiones de las minimas, psycopg2 siempre mantiene abiertas las minimas) 
2. **maxconn**:  Número máximo de conexiones que el pool puede abrir. Esto limita la cantidad de conexiones simultáneas para evitar sobrecar

## Bondades

- **Multiples formas de conexion**: psycopg2 provee 4 clases para manejar las conexiones y hasta se puede utilizar la clase abstracta para crear nuevas conexiones a nuestro gusto.

- - **AbstractConnectionPool**: Si desea crear una implementación personalizada para el grupo de conexiones, puede ampliar esta clase e implementar sus métodos.

### Código de Ejemplo

```python

# Se puede crear otra clases a partir de la clase abstracta
class CustomConnectionPool(psycopg2.pool.AbstractConnectionPool):
    def __init__(self, minconn, maxconn, *args, **kwargs):
        super().__init__(minconn, maxconn, *args, **kwargs)

    def _connect(self, key=None): 
        try:# Por lo que se puede sobrescribir las funciones de conexion
            conn = psycopg2.connect(*self._args, **self._kwargs)
            print("Connection established")
            return conn
        except psycopg2.DatabaseError as e:
            print(f"Error connecting to database: {e}")
            raise

    def _disconnect(self, conn):
        conn.close()
    
    # Y tambien se puede agregar funciones a la clase personalizada
    def check_connections(self):
        for conn in self._used:
            if conn.closed:
                print("Connection closed")
            else:
                print("Connection open")

# Se puede conectar a la conexion personalizada como una conexion comun
custom_pool = CustomConnectionPool(
    minconn=1,
    maxconn=10,
    user='postgres',
    password='test123',
    host='localhost',
    port='5432',
    database='test'
)
conn = custom_pool.getconn()

# Y usar la conexión personalizada como una conexion comun
cursor = conn.cursor()
cursor.execute("SELECT * FROM tu_tabla;")
records = cursor.fetchall()

# Liberar la conexión de vuelta al pool
custom_pool.putconn(conn)

```

- - **SimpleConnectionPool**: Esta clase es adecuada solo para aplicaciones de un solo hilo.

### Código de Ejemplo

```python

pool = psycopg2.pool.SimpleConnectionPool( 
	  minconn=2 # Minimo de conexiones que se pueden mantener activas
	, maxconn=3 # Maximas conexiones que se pueden realizar al pool
	, user='postgres'
	, password='test123'
	, host='localhost'
	, port='5432'
	, database='test') 

# Se saca una conexion del pool
connection1 = pool.getconn() 

# Se usa la conexion
cursor = connection1.cursor() 
cursor.execute('SELECT * FROM person ORDER BY id') 

results = cursor.fetchall() # Se obtiene un array con el resultado
```

- - **ThreadedConnectionPool**:Como su nombre indica, esta clase se utiliza en un entorno con multiples hilos de ejecucion. Es decir, el grupo de conexiones creado con esta clase se puede compartir entre varios subprocesos.

### Código de Ejemplo

```python

threaded_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1, # Minimo de conexiones que se pueden mantener activas
    maxconn=10,# Maximas conexiones que se pueden realizar al pool
    user='postgres',
    password='test123',
    host='localhost',
    port='5432',
    database='test'
)

# Obtener una conexión del pool
conn = threaded_pool.getconn()

def worker(thread_id): #Funcion de ejemplo
    # Obtener una conexión del pool
    conn = threaded_pool.getconn()
    if conn:
        # Usar la conexión
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tu_tabla;")
        records = cursor.fetchall()# Se obtiene un array con el resultado

        # Liberar la conexión de vuelta al pool
        threaded_pool.putconn(conn)


# Crear y lanzar threads
threads = []
for i in range(5):
    # Se utiliza la Funcion de ejemplo en el thread 
    thread = threading.Thread(target=worker, args=(i,))
    threads.append(thread)
    thread.start()

# Esperar a que todos los threads terminen
for thread in threads:
    thread.join()

```

- - **PersistentConnectionPool**: Esta clase se utiliza en la aplicación multihilo, donde un grupo asigna conexiones persistentes a diferentes subprocesos, estas conexiones se mantienen abiertas. Cada subproceso obtiene una sola conexión del grupo, es decir, el subproceso no puede usar más de una conexión del grupo.


### Código de Ejemplo

```python
# Configuración del pool de conexiones persistentes
persistent_pool = PersistentConnectionPool(
    minconn=1,
    maxconn=10,
    user='tu_usuario',
    password='tu_contraseña',
    host='tu_host',
    port='tu_puerto',
    database='tu_base_de_datos'
)

# Usar la conexión
cursor = conn.cursor()
cursor.execute("SELECT * FROM tu_tabla;")
records = cursor.fetchall()  # Se obtiene un array con el resultado
            
persistent_pool.putconn(conn)
```

## Problema o limitante:

**Falta de reciclaje de conexiones**:Psycopg2 no recicla automáticamente las conexiones que ya no se utilizan. Esto puede llevar a un uso ineficiente de los recursos, ya que las conexiones inactivas permanecen abiertas y ocupan memoria y otros recursos del sistema.

**Solo para PostgreSQL**: Psycopg2 está diseñado específicamente para trabajar con bases de datos PostgreSQL. No es compatible con otros sistemas de gestión de bases de datos.


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