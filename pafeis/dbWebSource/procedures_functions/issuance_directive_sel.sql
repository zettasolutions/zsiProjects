-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 5:58 PM
-- Description:	Issuance directive select stored procedure.
-- ===================================================================================================
-- Update by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[issuance_directive_sel]
(
    @issuance_directive_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @issuance_directive_id IS NOT NULL  
	 SELECT * FROM dbo.issuance_directive_v WHERE issuance_directive_id = @issuance_directive_id; 
  ELSE
     SELECT * FROM dbo.issuance_directive_v
	 ORDER BY issuance_directive_id DESC; 
	
END

