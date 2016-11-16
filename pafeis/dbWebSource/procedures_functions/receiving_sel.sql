

-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 7:58 PM
-- Description:	Issuance select stored procedure.
-- ===================================================================================================
-- Update by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[receiving_sel]
(
    @receiving_id  INT = null
   ,@status_id    INT = NULL
   ,@col_no       INT = 1
   ,@order_no     INT = 0
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)

  SET @stmt =  'SELECT * FROM dbo.receiving_v WHERE 1=1 '
  
  IF @receiving_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND receiving_id = ' + CAST(@receiving_id AS VARCHAR(20)); 

  IF @status_id IS NOT NULL
     SET @stmt = @stmt + ' AND status_id = ' + CAST(@status_id AS VARCHAR(20)); 

  SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
   
	
END



