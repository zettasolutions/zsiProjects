
CREATE VIEW [dbo].[item_types_v]
AS
SELECT        dbo.item_types.*, dbo.countItemCodes(item_type_id) AS countItemCodes
FROM            dbo.item_types

