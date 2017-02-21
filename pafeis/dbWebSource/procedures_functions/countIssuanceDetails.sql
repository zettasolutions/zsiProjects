
-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 7:46 PM
-- Description:	Count issuance details per parent id.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE FUNCTION [dbo].[countIssuanceDetails] 
(
	@issuance_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.issuance_details WHERE issuance_id = @issuance_id

   RETURN @l_retval;
END;

