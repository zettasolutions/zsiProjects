
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 3:40 PM
-- Description:	Dealer select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[dealer_sel]
(
    @dealer_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @dealer_id IS NOT NULL  
	 SELECT * FROM dbo.dealer WHERE dealer_id = @dealer_id; 
  ELSE
     SELECT * FROM dbo.dealer
	 ORDER BY dealer_name; 
	
END

