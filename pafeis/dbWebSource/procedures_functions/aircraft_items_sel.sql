
CREATE PROCEDURE [dbo].[aircraft_items_sel]
(
  @aircraft_info_id INT
)
AS
BEGIN
SET NOCOUNT ON

  SELECT * FROM dbo.aircraft_items_v WHERE aircraft_info_id = @aircraft_info_id ORDER BY seq1,seq2


	
END

