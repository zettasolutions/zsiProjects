
CREATE VIEW [dbo].[wings_v]
AS
SELECT dbo.wings.*, dbo.countSquadrons(wing_id) AS countSquadrons
FROM     dbo.wings
