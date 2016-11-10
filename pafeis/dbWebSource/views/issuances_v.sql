
CREATE VIEW [dbo].[issuances_v]
AS
SELECT        dbo.issuances.*, dbo.countIssuanceDetails(issuance_id) AS countIssuanceDetails
FROM            dbo.issuances

