CREATE DATABASE [order-db]
GO

USE [order-db];
GO

CREATE TABLE [dbo].[user] (
    [id]          INT IDENTITY(1,1) NOT NULL,
    [name]        VARCHAR (64) NOT NULL,
    [password]    VARCHAR (25) NOT NULL,
    CONSTRAINT [PK_user] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[client] (
    [id]        INT IDENTITY(1,1) NOT NULL,
    [name]      VARCHAR (64)  NOT NULL,
    [phone]     VARCHAR (16)  NOT NULL,
    [direction] VARCHAR (128) NOT NULL,
    [active]    BIT           NOT NULL,
    CONSTRAINT [PK_client] PRIMARY KEY CLUSTERED ([id] ASC),
);

CREATE TABLE [dbo].[state] (
    [id]   INT IDENTITY(1,1) NOT NULL,
    [name] VARCHAR (32) NOT NULL,
    CONSTRAINT [PK_state] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[size] (
    [id]   INT IDENTITY(1,1) NOT NULL,
    [name] VARCHAR (5) NOT NULL,
    CONSTRAINT [PK_size] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[neckType] (
    [id]   INT IDENTITY(1,1) NOT NULL,
    [name] VARCHAR (16) NOT NULL,
    CONSTRAINT [PK_neckType] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[image] (
    [id]    INT IDENTITY(1,1) NOT NULL,
    [image] VARCHAR (MAX) NOT NULL,
	[idClient] [int] NOT NULL,
	[date] [date] NOT NULL,
    CONSTRAINT [PK_image] PRIMARY KEY CLUSTERED ([id] ASC)
);

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date] [date] NOT NULL,
	[idClient] [int] NOT NULL,
	[idImgDesign] [int] NOT NULL,
	[quantity] [smallint] NOT NULL,
	[total] [money] NOT NULL,
	[idImgFirstPayment] [int] NOT NULL,
	[idImgSecondPayment] [int] NULL,
	[idState] [int] NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[order] ADD  CONSTRAINT [PK_order] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD  CONSTRAINT [FK_order_client] FOREIGN KEY([idClient])
REFERENCES [dbo].[client] ([id])
GO
ALTER TABLE [dbo].[order] CHECK CONSTRAINT [FK_order_client]
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD  CONSTRAINT [FK_order_image_design] FOREIGN KEY([idImgDesign])
REFERENCES [dbo].[image] ([id])
GO
ALTER TABLE [dbo].[order] CHECK CONSTRAINT [FK_order_image_design]
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD  CONSTRAINT [FK_order_image_first_payment] FOREIGN KEY([idImgFirstPayment])
REFERENCES [dbo].[image] ([id])
GO
ALTER TABLE [dbo].[order] CHECK CONSTRAINT [FK_order_image_first_payment]
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD  CONSTRAINT [FK_order_state] FOREIGN KEY([idState])
REFERENCES [dbo].[state] ([id])
GO
ALTER TABLE [dbo].[order] CHECK CONSTRAINT [FK_order_state]
GO


GO
CREATE TABLE [dbo].[unit] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [idOrder]     INT           NOT NULL,
    [idSize]      INT           NOT NULL,
    [idNeckType]  INT           NOT NULL,
    [description] VARCHAR (256) NULL,
    [idState]     INT           NOT NULL,
    CONSTRAINT [PK_unit] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_unit_neckType] FOREIGN KEY ([idNeckType]) REFERENCES [dbo].[neckType] ([id]),
    CONSTRAINT [FK_unit_order] FOREIGN KEY ([idOrder]) REFERENCES [dbo].[order] ([id]),
    CONSTRAINT [FK_unit_size] FOREIGN KEY ([idSize]) REFERENCES [dbo].[size] ([id]),
    CONSTRAINT [FK_unit_state] FOREIGN KEY ([idState]) REFERENCES [dbo].[state] ([id])
);

GO

CREATE TABLE [dbo].[stateChangeOrder] (
    [id]              INT IDENTITY(1,1) NOT NULL,
    [idOrder]         INT           NOT NULL,
    [idUser]          INT           NOT NULL,
    [idOriginalState] INT           NOT NULL,
    [idActualState]   INT           NOT NULL,
    [date]            DATETIME2 (7) NOT NULL,
    CONSTRAINT [PK_stateChangeOrder] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_stateChangeOrder_actual_state] FOREIGN KEY ([idActualState]) REFERENCES [dbo].[state] ([id]),
    CONSTRAINT [FK_stateChangeOrder_order] FOREIGN KEY ([idOrder]) REFERENCES [dbo].[order] ([id]),
    CONSTRAINT [FK_stateChangeOrder_original_state] FOREIGN KEY ([idOriginalState]) REFERENCES [dbo].[state] ([id]),
    CONSTRAINT [FK_stateChangeOrder_user] FOREIGN KEY ([idUser]) REFERENCES [dbo].[user] ([id])
);

GO

CREATE TABLE [dbo].[payment] (
    [id]             INT   IDENTITY (1, 1) NOT NULL,
    [date]           DATE  NOT NULL,
    [idOrder]        INT   NOT NULL,
    [idClient]       INT   NOT NULL,
    [idImage]        INT   NOT NULL,
    [amount]         MONEY NOT NULL,
    [isFirstPayment] BIT   NOT NULL,
    CONSTRAINT [PK_payment] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_payment_client] FOREIGN KEY ([idClient]) REFERENCES [dbo].[client] ([id]),
    CONSTRAINT [FK_payment_image] FOREIGN KEY ([idImage]) REFERENCES [dbo].[image] ([id]),
    CONSTRAINT [FK_payment_order] FOREIGN KEY ([idOrder]) REFERENCES [dbo].[order] ([id])
);

GO

CREATE TABLE [dbo].[reason] (
    [id]   INT IDENTITY(1,1) NOT NULL,
    [name] VARCHAR (64) NOT NULL,
    CONSTRAINT [PK_reason] PRIMARY KEY CLUSTERED ([id] ASC)
);

GO

CREATE TABLE [dbo].[cancelation] (
    [id]       INT  IDENTITY (1, 1) NOT NULL,
    [idOrder]  INT  NOT NULL,
    [idState]  INT  NOT NULL,
    [date]     DATE NOT NULL,
    [idReason] INT  NOT NULL,
    CONSTRAINT [PK_cancelation] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_cancelation_order] FOREIGN KEY ([idOrder]) REFERENCES [dbo].[order] ([id]),
    CONSTRAINT [FK_cancelation_reason] FOREIGN KEY ([idReason]) REFERENCES [dbo].[reason] ([id]),
    CONSTRAINT [FK_cancelation_state] FOREIGN KEY ([idState]) REFERENCES [dbo].[state] ([id])
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
-- Stored procedures
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

GO

CREATE PROCEDURE [dbo].[create_order]
	@inName VARCHAR (64)
    , @inPhone VARCHAR (16)
    , @inDirection VARCHAR (128)
    , @inQuantity INT
    , @inUnit NVARCHAR(MAX)
    , @inTotal MONEY
    , @inImgDesign VARCHAR (MAX)
    , @inImgFirstPayment VARCHAR (MAX)
    , @inImgSecondPayment VARCHAR (MAX)
	, @outResultCode INT OUTPUT
AS
BEGIN
    DECLARE @idClient INT;
    DECLARE @idImgDesign INT;
    DECLARE @idImgFirstPayment INT;
    DECLARE @idImgSecondPayment INT;
    DECLARE @idOrder INT;
    
    SELECT @idClient = id 
    FROM dbo.client 
    WHERE phone = @inPhone; 
	
    IF @idClient IS NULL
    BEGIN
        INSERT INTO dbo.[client] (name, phone, direction)
        VALUES (@inName, @inPhone, @inDirection);
        SET @idClient = @@IDENTITY;
    END;

    INSERT INTO dbo.image (image, idClient, date)
    VALUES (@inImgDesign, @idClient, CURRENT_TIMESTAMP);
    SET @idImgDesign = @@IDENTITY;

    INSERT INTO dbo.image (image, idClient, date)
    VALUES (@inImgFirstPayment, @idClient, CURRENT_TIMESTAMP);
    SET @idImgFirstPayment = @@IDENTITY;
    
    IF @inImgSecondPayment IS NOT NULL
    BEGIN
        INSERT INTO dbo.image (image, idClient, date)
        VALUES (@inImgSecondPayment, @idClient, CURRENT_TIMESTAMP);
        SET @idImgSecondPayment = @@IDENTITY;
    END;
    ELSE
    BEGIN
        SET @idImgSecondPayment = NULL
    END;

    INSERT INTO dbo.[order] ([date], idClient, idImgDesign, quantity, total, idImgFirstPayment, idImgSecondPayment, idState)
    VALUES (CURRENT_TIMESTAMP, @idClient, @idImgDesign, @inQuantity, @inTotal, @idImgFirstPayment, @idImgSecondPayment, 1);
    SET @idOrder = @@IDENTITY;

    INSERT INTO dbo.unit (idOrder, idSize, idNeckType, [description], idState)
    SELECT @idOrder, a.id, b.id, detail, 1
    FROM OPENJSON(@inUnit) WITH ([size] VARCHAR(5), neckType VARCHAR(16), detail VARCHAR(256))
    INNER JOIN dbo.size a ON a.name = [size]
    INNER JOIN dbo.neckType b ON b.name = neckType;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_orders_by_phone]
	@outResultCode INT OUTPUT
    , @inPhone VARCHAR(16)
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idClient INT;

    SELECT @idClient = id
    FROM dbo.client a 
    WHERE a.phone = @inPhone;
	
    SELECT a.date, b.image, a.id, c.name, a.total
    FROM dbo.[order] a
    INNER JOIN dbo.image b ON b.id = a.idImgDesign 
    INNER JOIN dbo.state c ON c.id = a.idState 
    WHERE a.idClient = @idClient;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_order_by_id]
	@outResultCode INT OUTPUT
    , @inId INT
AS
BEGIN
SET NOCOUNT ON;



    SELECT o.id
    ,o.[date]
    , b.name AS state
    , a.name
    , a.phone
    , a.direction
    , o.quantity
    , o.total
    , o.idImgDesign
    , o.idImgFirstPayment
    , o.idImgSecondPayment
    FROM dbo.[order] o
    INNER JOIN dbo.client a ON a.id = o.idClient
    INNER JOIN dbo.[state] b ON b.id = o.idState
    WHERE o.id = @inId;


    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_units_by_order_id]
	@outResultCode INT OUTPUT
    , @inId VARCHAR(16)
AS
BEGIN
SET NOCOUNT ON;
    SELECT a.name AS size, b.name AS neckType, u.[description], d.name AS state
    FROM dbo.[unit] u
    INNER JOIN dbo.[size] a ON a.id = u.idSize
    INNER JOIN dbo.neckType b ON b.id = u.idNeckType
    INNER JOIN dbo.[state] d ON d.id = u.idState
    WHERE u.idOrder = @inId

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_image_by_id]
	@outResultCode INT OUTPUT
    , @inId VARCHAR(16)
AS
BEGIN
SET NOCOUNT ON;

    SELECT [image]
    FROM dbo.[image]
    WHERE id = @inId

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[update_client]
	@inNewname VARCHAR (64)
    , @inNewDirection VARCHAR (128)
    , @inOldPhone VARCHAR (16)
    , @inNewPhone VARCHAR (16)
	, @outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idClient INT;
    
    UPDATE dbo.client
    SET name = @inNewname
    , direction = @inNewDirection
    , phone = @inNewPhone
    WHERE @inOldPhone = phone;


    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[update_unit]
	@inNewSize VARCHAR (5)
    , @inNewNecktType VARCHAR (16)
    , @inNewDescription VARCHAR (256)
    , @inId INT
	, @outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idClient INT;
    DECLARE @idNeckType INT;
    DECLARE @idSize INT;
    
    SELECT @idSize = id
    FROM dbo.[size]
    WHERE name = @inNewSize

    SELECT @idNeckType = id
    FROM dbo.[neckType]
    WHERE name = @inNewNecktType

    UPDATE dbo.unit
    SET idSize = @idSize
    , idNeckType = @idNeckType
    , [description] = @inNewDescription
    WHERE id = @inId;


    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[upload_second_payment]
    @inImgSecondPayment VARCHAR (MAX)
    , @inId INT
    , @inPhone INT
	, @outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idClient INT;
    DECLARE @idImgSecondPayment INT;
    
    SELECT @idClient = id 
    FROM dbo.client 
    WHERE phone = @inPhone; 
	
    INSERT INTO dbo.image (image, idClient, date)
    VALUES (@inImgSecondPayment, @idClient, CURRENT_TIMESTAMP);
    SET @idImgSecondPayment = @@IDENTITY;

    UPDATE dbo.[order]
    SET idImgSecondPayment = @idImgSecondPayment
    WHERE id = @inId;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[delete_order]
	@outResultCode INT OUTPUT
    , @inId INT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idImgDesign INT;
    DECLARE @idImgFirstPayment INT;
    DECLARE @idImgSecondPayment INT;

    SELECT @idImgDesign = idImgDesign
    , @idImgFirstPayment = idImgFirstPayment
    , @idImgSecondPayment = idImgSecondPayment
    FROM dbo.[order]

    DELETE U
    FROM dbo.[unit] U
    INNER JOIN dbo.[order] A ON A.id = U.idOrder

    DELETE FROM dbo.[order]
    WHERE @inId = id;

    -- DELETE 
    -- FROM dbo.[image] 
    -- WHERE @idImgDesign = id 
    -- OR @idImgFirstPayment = id
    -- OR @idImgSecondPayment = id;

    SELECT * 
    FROM dbo.[image] 
    WHERE @idImgDesign = id 
    OR @idImgFirstPayment = id
    OR @idImgSecondPayment = id;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[delete_image]
	@outResultCode INT OUTPUT
    , @inId INT
AS
BEGIN
SET NOCOUNT ON;

    DELETE FROM dbo.[image]
    WHERE @inId = id;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[login]
    @inPassword VARCHAR (16)
    , @inName VARCHAR (16)
	, @outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;

    SELECT id
    FROM dbo.[user]
    WHERE [name] = @inName AND [password] = @inPassword;
    
    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_orders_pending]
	@outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idDelivered INT;
    DECLARE @idCanceled INT;
    
    SELECT @idDelivered = id 
    FROM dbo.[state] 
    WHERE name = 'Entregado';
    
    SELECT @idCanceled = id 
    FROM dbo.[state] 
    WHERE name = 'Cancelada';

    SELECT a.id
    , i.[image]
    , c.phone
    , a.date
    , s.name AS state
    FROM dbo.[order] a
    INNER JOIN dbo.[image] i ON a.idImgDesign = i.id
    INNER JOIN dbo.[client] c ON a.idClient = c.id
    INNER JOIN dbo.[state] s ON a.idState = s.id
    WHERE a.idState != @idDelivered
    AND a.idState != @idCanceled;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_payment]
    @inId INT
	,@outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;

    SELECT amount, isFirstPayment
    FROM dbo.payment
    WHERE @inId = idOrder

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO 

CREATE PROCEDURE [dbo].[read_clients]
	@outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;

    SELECT name, phone, direction
    FROM dbo.client

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO 

CREATE PROCEDURE [dbo].[create_payment]
    @inDate Date 
    ,@inAmount Money 
    ,@inId Int 
    ,@inName VarChar(32)
    ,@inIdImg Int 
    ,@inIsFirstPayment Bit 
	,@outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idClient INT;

    SELECT @idClient = id 
    FROM dbo.client 
    WHERE @inName = name

    INSERT INTO dbo.payment (
        [date]
        , amount
        , idOrder
        , idClient
        , idImage
        , isFirstPayment) 
    VALUES (
        @inDate
        , @inAmount
        , @inId
        , @idClient
        , @inIdImg
        , @inIsFirstPayment
        );

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO 

CREATE PROCEDURE [dbo].[change_state]
    @inName VarChar(32) 
    ,@inIdOrder Int 
	,@outResultCode INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idState INT;

    SELECT @idState = id
    FROM dbo.State
    WHERE @inName = name

    UPDATE dbo.[order]
    SET idState = @idState
    WHERE @inIdOrder = id

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[create_cancelation]
	@outResultCode INT OUTPUT
    , @inId INT
    , @inDate DATE
    , @inReason VARCHAR (64)
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idState INT;
    DECLARE @idReason INT;

    SELECT @idState = id
    FROM dbo.[state] 
    WHERE name = 'Procesando';
	
    SELECT @idReason = id
    FROM dbo.[reason] 
    WHERE name = @inReason;

    INSERT INTO dbo.cancelation (
        idOrder
        , idState
        , [date]
        , idReason)
    VALUES (
        @inId
        ,@idState
        ,@inDate
        ,@idReason);

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[read_reason]
	@outResultCode INT OUTPUT
    , @inId INT
AS
BEGIN
SET NOCOUNT ON;

    SELECT TOP 1 r.name, c.id
    FROM dbo.[cancelation] c
    INNER JOIN dbo.[reason] r ON c.idReason = r.id
    WHERE idOrder = @inId
    ORDER BY c.[date] DESC;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[reject_cancelation]
	@outResultCode INT OUTPUT
    , @inId INT
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @idState INT; 

    SELECT @idState = id 
    FROM dbo.[state] 
    WHERE name = 'Rechazada';

    UPDATE dbo.cancelation
    SET idState = @idState
    WHERE id = @inId;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

CREATE PROCEDURE [dbo].[accept_cancelation]
	@outResultCode INT OUTPUT
    , @inId INT
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @idState INT; 

    SELECT @idState = id 
    FROM dbo.[state] 
    WHERE name = 'Aceptada';

    UPDATE dbo.cancelation
    SET idState = @idState
    WHERE id = @inId;

    SET @outResultCode=0;
SET NOCOUNT OFF;
END;

GO

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
-- Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

GO

INSERT INTO [dbo].[neckType] ([name])
VALUES ('Redondo'),('V'),('Polo');

INSERT INTO [dbo].[size] ([name])
VALUES ('XL'),('L'),('M'),('S'),('16'),('14'),('12'),('10'),('8');

INSERT INTO [dbo].[state] ([name])
VALUES ('En fabricación'),('Entregado'),('Listo'),('Cancelando'),('Cancelada'),('Procesando'),('Aceptada'),('Rechazada');

INSERT INTO [dbo].[reason] ([name])
VALUES ('Contenido inapropiado'),('Información confusa'),('Falta de información'),('Mucho tiempo de espera'),('Encontré una mejor oferta'),('Ya no quiero comprar');

INSERT INTO [dbo].[user] ([name], password)
VALUES ('admin', 'admin');
