select * from items
SELECT * FROM Notifications ORDER BY Created_At DESC


INSERT INTO Notifications (U_Id, Item_Id, Message, Is_Read, Created_At)
SELECT 1, Item_Id, Item_Name + ' is low! Only ' + CAST(Quantity AS NVARCHAR) + ' left.', 0, GETDATE()
FROM Items
WHERE Quantity <= 1.0 
AND Item_Id NOT IN (SELECT Item_Id FROM Notifications WHERE Message LIKE '%low%')