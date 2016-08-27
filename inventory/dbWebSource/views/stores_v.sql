CREATE VIEW dbo.stores_v
AS
SELECT        store_id AS Expr1, store_name AS Expr2, created_by AS Expr3, created_date AS Expr4, updated_by AS Expr5, updated_date AS Expr6, dbo.stores.*
FROM            dbo.stores
