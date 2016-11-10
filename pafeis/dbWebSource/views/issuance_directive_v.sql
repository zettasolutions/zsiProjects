
CREATE VIEW [dbo].[issuance_directive_v]
AS
SELECT        dbo.issuance_directive.*, dbo.countIssuanceDirectiveDetail(issuance_directive_id) AS countIssuanceDirectiveDetail
FROM            dbo.issuance_directive

