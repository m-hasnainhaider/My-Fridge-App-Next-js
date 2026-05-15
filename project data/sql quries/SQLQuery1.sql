CREATE DATABASE MyFridgeFood;
GO
USE MyFridgeFood;
GO

-- =========================
-- 1️⃣ Users
-- =========================
CREATE TABLE Users (
    U_Id INT IDENTITY(1,1) PRIMARY KEY,
    U_Name NVARCHAR(100) NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Created_At DATETIME DEFAULT GETDATE()
);

-- =========================
-- 2️⃣ Category (Global)
-- =========================
CREATE TABLE Category (
    Cat_Id INT IDENTITY(1,1) PRIMARY KEY,
    Cat_Name NVARCHAR(100) NOT NULL,
    Created_At DATETIME DEFAULT GETDATE()
);

-- =========================
-- 3️⃣ Fridge
-- =========================
CREATE TABLE Fridge (
    Fridge_Id INT IDENTITY(1,1) PRIMARY KEY,
    Fridge_Name NVARCHAR(100) NOT NULL,
    U_Id INT NOT NULL,
    Rating INT NOT NULL DEFAULT 1,
    Created_At DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (U_Id) REFERENCES Users(U_Id)
);

-- =========================
-- 4️⃣ Items
-- =========================
CREATE TABLE Items (
    Item_Id INT IDENTITY(1,1) PRIMARY KEY,
    Item_Name NVARCHAR(100) NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    Unit NVARCHAR(20) NOT NULL,
    Expiry_Date DATE NULL,
    IsFreezer BIT DEFAULT 0,
    Fridge_Id INT NOT NULL,
    Cat_Id INT NOT NULL,
    Created_At DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (Fridge_Id) REFERENCES Fridge(Fridge_Id),
    FOREIGN KEY (Cat_Id) REFERENCES Category(Cat_Id)
);

-- =========================
-- 5️⃣ Item Pairing
-- =========================
CREATE TABLE ItemPairs (
    Pair_Id INT IDENTITY(1,1) PRIMARY KEY,
    Base_Cat_Id INT NOT NULL,
    Recommended_Cat_Id INT NOT NULL,
    Priority INT DEFAULT 1,

    FOREIGN KEY (Base_Cat_Id) REFERENCES Category(Cat_Id),
    FOREIGN KEY (Recommended_Cat_Id) REFERENCES Category(Cat_Id)
);

-- =========================
-- 6️⃣ Recipes
-- =========================
CREATE TABLE Recipes (
    Recipe_Id INT IDENTITY(1,1) PRIMARY KEY,
    Recipe_Name NVARCHAR(150) NOT NULL,
    Fridge_Id INT NOT NULL,
    Created_At DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (Fridge_Id) REFERENCES Fridge(Fridge_Id)
);

-- =========================
-- 7️⃣ Recipe Ingredients
-- =========================
CREATE TABLE RecipeIngredients (
    RecipeIngredient_Id INT IDENTITY(1,1) PRIMARY KEY,
    Recipe_Id INT NOT NULL,
    Cat_Id INT NOT NULL,
    Quantity DECIMAL(6,2) NOT NULL,
    Unit NVARCHAR(20) NOT NULL,

    FOREIGN KEY (Recipe_Id) REFERENCES Recipes(Recipe_Id),
    FOREIGN KEY (Cat_Id) REFERENCES Category(Cat_Id)
);

-- =========================
-- 8️⃣ Notifications
-- =========================
CREATE TABLE Notifications (
    Notification_Id INT IDENTITY(1,1) PRIMARY KEY,
    U_Id INT NOT NULL,
    Item_Id INT NOT NULL,
    Message NVARCHAR(255),
    Is_Read BIT DEFAULT 0,
    Created_At DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (U_Id) REFERENCES Users(U_Id),
    FOREIGN KEY (Item_Id) REFERENCES Items(Item_Id)
);

-- =========================
-- 9️⃣ Fridge Users (Sharing)
-- =========================
CREATE TABLE FridgeUsers (
    FridgeUser_Id INT IDENTITY(1,1) PRIMARY KEY,
    Fridge_Id INT NOT NULL,
    U_Id INT NOT NULL,
    Role NVARCHAR(50) DEFAULT 'Member',

    FOREIGN KEY (Fridge_Id) REFERENCES Fridge(Fridge_Id),
    FOREIGN KEY (U_Id) REFERENCES Users(U_Id)
);

select * from Users
-- Users
INSERT INTO Users (U_Name, Email, Password)
VALUES 
('Ali', 'ali@gmail.com', '123'),
('Ahmed', 'ahmed@gmail.com', '123');

-- Categories
INSERT INTO Category (Cat_Name)
VALUES ('Dairy'), ('Fruit'), ('Vegetable'), ('Meat'), ('Frozen');

-- Fridges
INSERT INTO Fridge (Fridge_Name, U_Id, Rating)
VALUES 
('Ali Fridge', 1, 5),
('Ahmed Fridge', 2, 4);

-- Items
INSERT INTO Items (Item_Name, Quantity, Unit, Expiry_Date, Fridge_Id, Cat_Id)
VALUES 
('Milk', 2.0, 'Liters', '2026-03-30', 1, 1),
('Apple', 6, 'Pieces', '2026-03-28', 1, 2);

-- Recipes
INSERT INTO Recipes (Recipe_Name, Fridge_Id)
VALUES 
('Chicken Biryani', 1),
('Omelette', 1);

-- Recipe Ingredients
INSERT INTO RecipeIngredients (Recipe_Id, Cat_Id, Quantity, Unit)
VALUES 
(1, 4, 1.0, 'Kg'),
(2, 1, 2.0, 'Pieces');

