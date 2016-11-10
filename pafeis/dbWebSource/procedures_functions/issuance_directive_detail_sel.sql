
-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 6:43 PM
-- Description:	Issuance directive details select stored procedure.
-- ===================================================================================================
-- Update by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[issuance_directive_detail_sel]
(
    @issuance_directive_detail_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @issuance_directive_detail_id IS NOT NULL  
	 SELECT * FROM dbo.issuance_directive_detail WHERE issuance_directive_detail_id = @issuance_directive_detail_id; 
  ELSE
     SELECT * FROM dbo.issuance_directive_detail
	
END


