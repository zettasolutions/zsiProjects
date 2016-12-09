

CREATE PROCEDURE [dbo].[issuance_directive_detail_sel]
(
    @issuance_directive_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @issuance_directive_id IS NOT NULL  
	 SELECT * FROM dbo.issuance_directive_detail WHERE issuance_directive_id = @issuance_directive_id; 
  ELSE
     SELECT * FROM dbo.issuance_directive_detail
	
END


