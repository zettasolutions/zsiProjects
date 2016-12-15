CREATE VIEW dbo.items_on_stock_v
AS
SELECT        dbo.items_inv_v.*
FROM            dbo.items_inv_v
WHERE        (stock_qty > 0)
