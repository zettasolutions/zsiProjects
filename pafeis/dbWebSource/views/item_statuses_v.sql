
CREATE VIEW [dbo].[item_statuses_v]
AS
SELECT        dbo.statuses.*
FROM            dbo.statuses
WHERE        (is_item = 'Y')

