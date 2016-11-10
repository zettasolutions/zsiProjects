-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 6:02 PM
-- Description:	Count issuance directive details per parent id.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE FUNCTION [dbo].[countIssuanceDirectiveDetail] 
(
	@issuance_directive_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.issuance_directive_detail WHERE @issuance_directive_id = @issuance_directive_id

   RETURN @l_retval;
END;


