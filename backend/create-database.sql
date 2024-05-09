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
    [id]                 INT IDENTITY(1,1) NOT NULL,
    [date]               DATE     NOT NULL,
    [idUser]             INT      NOT NULL,
    [idImgDesign]        INT      NOT NULL,
    [quantity]           SMALLINT NOT NULL,
    [total]              MONEY    NOT NULL,
    [idImgFirstPayment]  INT      NOT NULL,
    [idImgSecondPayment] INT      NOT NULL,
    [idState]            INT      NOT NULL,
    CONSTRAINT [PK_order] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_order_image_design] FOREIGN KEY ([idImgDesign]) REFERENCES [dbo].[image] ([id]),
    CONSTRAINT [FK_order_image_first_payment] FOREIGN KEY ([idImgFirstPayment]) REFERENCES [dbo].[image] ([id]),
    CONSTRAINT [FK_order_state] FOREIGN KEY ([idState]) REFERENCES [dbo].[state] ([id]),
    CONSTRAINT [FK_order_user] FOREIGN KEY ([idUser]) REFERENCES [dbo].[user] ([id])
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
    [idUser]    INT           NOT NULL,
    [name]      VARCHAR (64)  NOT NULL,
    [phone]     VARCHAR (16)  NOT NULL,
    [direction] VARCHAR (128) NOT NULL,
    CONSTRAINT [PK_client] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_client_user] FOREIGN KEY ([id]) REFERENCES [dbo].[user] ([id])
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