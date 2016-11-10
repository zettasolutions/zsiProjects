
-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 8:18 PM
-- Description:	Issuance details select stored procedure.
-- ===================================================================================================
-- Update by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[issuance_details_sel]
(
    @issuance_detail_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @issuance_detail_id IS NOT NULL  
	 SELECT * FROM dbo.issuance_details WHERE issuance_detail_id = @issuance_detail_id; 
  ELSE
     SELECT * FROM dbo.issuance_details
	
END

