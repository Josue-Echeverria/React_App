CREATE DATABASE [order-db]
GO

USE [order-db];
GO

CREATE TABLE [dbo].[user] (
    [id]          INT IDENTITY(1,1) NOT NULL,
    [name]        VARCHAR (64) NOT NULL,
    [password]    VARCHAR (25) NOT NULL,
    [is_employee] BIT          NOT NULL,
    CONSTRAINT [PK_user] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[state] (
    [id]   INT IDENTITY(1,1) NOT NULL,
    [name] VARCHAR (16) NOT NULL,
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
    [image] VARBINARY (MAX) NOT NULL,
    CONSTRAINT [PK_image] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[order] (
    [id]                 INT      IDENTITY (1, 1) NOT NULL,
    [date]               DATE     NOT NULL,
    [idClient]           INT      NOT NULL,
    [idImgDesign]        INT      NOT NULL,
    [quantity]           SMALLINT NOT NULL,
    [total]              MONEY    NOT NULL,
    [idImgFirstPayment]  INT      NOT NULL,
    [idImgSecondPayment] INT      NOT NULL,
    [idState]            INT      NOT NULL,
    CONSTRAINT [PK_order] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_order_client] FOREIGN KEY ([idClient]) REFERENCES [dbo].[client] ([id]),
    CONSTRAINT [FK_order_image_design] FOREIGN KEY ([idImgDesign]) REFERENCES [dbo].[image] ([id]),
    CONSTRAINT [FK_order_image_first_payment] FOREIGN KEY ([idImgFirstPayment]) REFERENCES [dbo].[image] ([id]),
    CONSTRAINT [FK_order_state] FOREIGN KEY ([idState]) REFERENCES [dbo].[state] ([id])
);

CREATE TABLE [dbo].[unit] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [idOrder]     INT           NOT NULL,
    [idSize]      INT           NOT NULL,
    [idNeckType]  INT           NOT NULL,
    [description] VARCHAR (256) NOT NULL,
    [idState]     INT           NOT NULL,
    CONSTRAINT [PK_unit] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_unit_neckType] FOREIGN KEY ([idNeckType]) REFERENCES [dbo].[neckType] ([id]),
    CONSTRAINT [FK_unit_order] FOREIGN KEY ([idOrder]) REFERENCES [dbo].[order] ([id]),
    CONSTRAINT [FK_unit_size] FOREIGN KEY ([idSize]) REFERENCES [dbo].[size] ([id]),
    CONSTRAINT [FK_unit_state] FOREIGN KEY ([idState]) REFERENCES [dbo].[state] ([id])
);


CREATE TABLE [dbo].[client] (
    [id]        INT IDENTITY(1,1) NOT NULL,
    [name]      VARCHAR (64)  NOT NULL,
    [phone]     VARCHAR (16)  NOT NULL,
    [direction] VARCHAR (128) NOT NULL,
    CONSTRAINT [PK_client] PRIMARY KEY CLUSTERED ([id] ASC),
);

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

CREATE TABLE [dbo].[stateChangeUnit] (
    [id]     INT IDENTITY(1,1) NOT NULL,
    [idUser] INT NOT NULL,
    [idUnit] INT NOT NULL,
    [date]   INT NOT NULL,
    CONSTRAINT [PK_stateChangeUnit] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_stateChangeUnit_unit] FOREIGN KEY ([idUnit]) REFERENCES [dbo].[unit] ([id]),
    CONSTRAINT [FK_stateChangeUnit_user] FOREIGN KEY ([idUser]) REFERENCES [dbo].[user] ([id])
);

GO

INSERT INTO [dbo].[neckType] ([name])
VALUES ('Cuello redondo'),('Cuello V'),('Cuello polo');

INSERT INTO [dbo].[size] ([name])
VALUES ('XL'),('L'),('M'),('S'),('16'),('14'),('12'),('10'),('8');


GO
CREATE PROCEDURE [dbo].[create_order]
	@inName VARCHAR (64)
    , @inPhone VARCHAR (16)
    , @inDirection VARCHAR (128)
    , @inQuantity INT
    , @inUnit NVARCHAR(MAX)
    , @inTotal MONEY
    , @inImgDesign VARBINARY (MAX)
    , @inImgFirstPayment VARBINARY (MAX)
    , @inImgSecondPayment VARBINARY (MAX)
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
CREATE PROCEDURE [dbo].[read_orders]
	@outResultCode INT OUTPUT
    , @inPhone VARCHAR(16)
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @idClient INT;

    SELECT @idClient = id
    FROM dbo.client a 
    WHERE a.phone = @inPhone;
	
    SELECT a.date, b.image, a.quantity, a.total, c.name 
    FROM dbo.[order] a
    INNER JOIN dbo.image b ON b.id = a.idImgDesign 
    INNER JOIN dbo.state c ON c.id = a.idState 
    WHERE a.idClient = @idClient

    SET @outResultCode=0

SET NOCOUNT OFF;
END;
GO


