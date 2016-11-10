
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 10:01 PM
-- Description:	Origin select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[origin_sel]
(
    @origin_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @origin_id IS NOT NULL  
	 SELECT * FROM dbo.origin WHERE origin_id = @origin_id; 
  ELSE
     SELECT * FROM dbo.origin
	 ORDER BY origin_name; 
	
END


